// src/routes/apiRoutes.ts

import { FastifyInstance, FastifyPluginOptions } from 'fastify';

interface LocationRequestBody {
    latitude: number;
    longitude: number;
  }

interface Photo {
  name: string
}

interface Place {
  id: string;
  displayName: { text: string };
  formattedAddress: string;
  websiteUri?: string;
  rating: number;
  photos: Photo[];
}

interface ResponseData {
  places: Place[];
}

interface RestaurantInfo {
  id: string;
  name: string;
  location: string;
  uri: string;
  rating: number;
  imgUri: string;
}

interface Review {
  author: string,
  text: string,
  relativetime: string,
}

interface RestaurantDetails {
  openNow: boolean,
  openingHours: string[],
  reviews: Review[]
}

// Methods

// get photo
async function fetchPlaceMedia(photoName: string): Promise<string> {
  const parameters = 'maxHeightPx=400&maxWidthPx=400';
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const url = `https://places.googleapis.com/v1/${photoName}/media?${parameters}&key=${apiKey}&skipHttpRedirect=true`;
  try {
      const response = await fetch(url, {
        method: 'GET', 
        headers: {
          'Accept': 'application/json' 
        }
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const photo = await response.json();
      return photo.photoUri;
      
  } catch (error) {
      console.error('Error fetching the place media:', error);
  }
}

async function getInfoList(data: ResponseData): Promise<RestaurantInfo[]> {
  const infoList: RestaurantInfo[] = await Promise.all(
    data.places.map(async (place) => {
      // console.log(place.photos);
      // const imgUri = await getValidImageUri(place.photos);  // Await the promise to resolve
      const imgUri = await fetchPlaceMedia(place.photos[0].name);  
      return {
        id: place.id,
        name: place.displayName.text,
        location: place.formattedAddress,
        uri: place.websiteUri ?? '',
        rating: place.rating,
        imgUri: imgUri,
      };
    })
  );
  return infoList;
}

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
          radius: 1000.0,
        },
      },
    };
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName.text,places.formattedAddress,places.websiteUri,places.rating,places.photos.name',
      },
      body: JSON.stringify(requestBody),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data;
  }

// get restaurant details
async function getPlaceDetails(id: string) {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured');
  }
  
  const url = `https://places.googleapis.com/v1/places/${id}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'currentOpeningHours.weekdayDescriptions,currentOpeningHours.openNow,reviews'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('place details fetched: ', data);

  const details: RestaurantDetails = {
    openNow: data.openNow,
    openingHours: data.currentOpeningHours?.weekdayDescriptions || [], 
    reviews: data.reviews.slice(0, 3).map(review => ({
        author: review.authorAttribution?.displayName || 'Unknown', 
        text: review.originalText?.text || 'No text available',
        relativetime: review.relativePublishTimeDescription || 'No time description available',
    }))
  };
  console.log('details: ', details);
  return details;
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
        // console.log(data);
        const infoList = await getInfoList(data);
        reply.send(infoList);

    } catch (error) {
      console.error('Error:', error);
      reply.status(500).send({ error: 'An error occurred while fetching data' });
    }
  });

  // get specific place details
  fastify.get('/api/res/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      
      if (!id) {
        return reply.status(400).send({ error: 'Missing restaurant ID' });
      }
      
      const placeDetails = await getPlaceDetails(id);
      reply.send(placeDetails);

    } catch (error) {
      console.error('Error:', error);
      reply.status(500).send({ error: 'An error occurred while fetching place details' });
    }
  });
}

export default apiRoutes;
