// src/routes/apiRoutes.ts

import { FastifyInstance, FastifyPluginOptions } from 'fastify';

interface LocationRequestBody {
    latitude: number;
    longitude: number;
  }

// Methods
async function fetchNearbyPlaces(lat: number, lng: number) {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  
    if (!apiKey) {
      throw new Error('API key not configured');
    }
  
    const url = 'https://places.googleapis.com/v1/places:searchNearby';
    const requestBody = {
      includedTypes: ["restaurant"],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude: lat,
            longitude: lng,
          },
          radius: 500.0,
        },
      },
    };
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName',
      },
      body: JSON.stringify(requestBody),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data;
  }
  


// Define routes
async function apiRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  
    // root
  fastify.get('/api', async (request, reply) => {
    return { message: 'Welcome to FoodGuide API!' };
  });

  // get nearby places
  fastify.post('/api/res', async (request, reply) => {
    try {
        const { latitude, longitude } = request.body as LocationRequestBody;
        
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          return reply.status(400).send({ error: 'Invalid or missing latitude/longitude' });
        }
        
        console.log('get position: ', latitude, longitude)
        const data = await fetchNearbyPlaces(latitude, longitude);
        reply.send(data);

    } catch (error) {
      console.error('Error:', error);
      reply.status(500).send({ error: 'An error occurred while fetching data' });
    }
  });
}

export default apiRoutes;
