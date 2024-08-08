const Fastify = require('fastify');
const cors = require('@fastify/cors');
const dotenv = require('dotenv');

dotenv.config();

const server = Fastify();
const url = 'https://places.googleapis.com/v1/places:searchText';
const requestBody = {
  textQuery: 'Chinese Restaurant in Stockholm, Sweden'
};

server.register(cors, {
  origin: '*'
});

server.get('/api', async (request, reply) => {
  return { message: 'Welcome to FoodGuide API!' };
});

server.get('/api/maps', async (request, reply) => {
  try {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

    if (!apiKey) {
      return reply.status(500).send({ error: 'API key not configured' });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log(data);
    reply.send(data);

  } catch (error) {
    console.error('Error:', error);
    reply.status(500).send({ error: 'An error occurred while fetching data' });
  }
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
