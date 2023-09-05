const Koa = require('koa');
const { koaBody } = require('koa-body');
const uuid = require('uuid');
const cors = require('@koa/cors');

const app = new Koa();
const tickets = [];

class Ticket {
  constructor(id, name, description, status, created) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.created = created;
  }

  get ticketShort() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      created: this.created
    }
  }

  get ticketFull() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      created: this.created
    }
  }
}

const firstTicket = new Ticket(uuid.v4(), 'Short description 1', 'description 1', false, new Date());
const secondTicket = new Ticket(uuid.v4(), 'Short description 2', 'description 2', false, new Date());
tickets.push(firstTicket);
tickets.push(secondTicket);

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  text: true,
  json: true,
}));

app.use(cors());

app.use(async (ctx) => {

  const { method } = ctx.query;
  const { name, description, status } = ctx.request.body;


  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      return;

    case 'ticketById':

      if (ctx.query.id) {
        const ticket = tickets.find((item) => item.id === ctx.query.id);
        // console.log(ticket)
        if (ticket) {
          ctx.response.body = ticket.ticketFull;
        } else {
          ctx.response.status = 404;
        }
      }
      return;

    case 'createTicket':
      const id = uuid.v4();
      const created = new Date();
      const newTicket = new Ticket(id, name, description, false, created)
      tickets.push(newTicket);
      ctx.response.body = newTicket;
      return;

    case 'removeById':
      const index = tickets.findIndex((item) => item.id === ctx.query.id);
      tickets.splice(index, 1);
      ctx.response.body = true;
      return;

    case 'updateById':
      const idx = tickets.findIndex((item) => item.id === ctx.query.id);

      if (idx < 0) return;

      tickets[idx].name = name ? name : tickets[idx].name;
      tickets[idx].status = status ? status : false;
      tickets[idx].description = description ? description : tickets[idx].description;
      ctx.response.body = tickets[idx];
      return;

    default:
      ctx.response.status = 404;
      return;
  }
});

module.exports = app;
