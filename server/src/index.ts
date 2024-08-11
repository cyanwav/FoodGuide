import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import placeRoutes from './routes/places';

dotenv.config();

const server: FastifyInstance = Fastify({
  logger: true
});

server.register(cors, {
  origin: true 
});

server.register(placeRoutes);

// Start the server and handle the promise
async function startServer() {
  server.listen({ port: 3000 }) 
  // server.listen({ port: 3000, host: '0.0.0.0' }) 
    .then(() => {
      console.log('Server listening on http://localhost:3000');
      // console.log('Server listening on http://0.0.0.0:3000');
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

startServer();

module.exports = server;
