import Fastify from 'fastify';
import cors from '@fastify/cors';

const server = Fastify();

server.register(cors, {
  origin: '*'
});

server.get('/api', async (request, reply) => {
    return { message: 'Welcome to FoodGuide API!' };
  });

// Start the server and handle the promise
server.listen({ port: 3000 })
  .then(() => {
    console.log('Server listening on http://localhost:3000');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
