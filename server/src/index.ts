const Fastify = require('fastify');
const cors = require('@fastify/cors');
const dotenv = require('dotenv');
const placeRoutes = require('./routes/places');

dotenv.config();

const server = Fastify();

server.register(cors, {
  origin: '*'
});

server.register(placeRoutes);

// Start the server and handle the promise
async function startServer() {
  server.listen({ port: 3000 })
  .then(() => {
    console.log('Server listening on http://localhost:3000');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

startServer();

module.exports = server;
