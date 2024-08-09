import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';

interface RestaurantInfo {
  id: string;
  name: string;
  location: string;
  uri: string;
}

interface Place {
  id: string;
  displayName: { text: string };
  formattedAddress: string;
  websiteUri?: string;
}

interface ResponseData {
  places: Place[];
}

const Home: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<RestaurantInfo[] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lon);
          sendLocationToServer(lat, lon); // Call the function to send data to the server
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setError("The request to get user location timed out.");
              break;
            default:
              setError("An unknown error occurred.");
              break;
          }
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to send the location to the server
  const sendLocationToServer = async (latitude: number, longitude: number) => {
    setLoading(true);
    console.log(JSON.stringify({ latitude, longitude }));
    try {
      const response = await fetch('http://localhost:3000/api/res', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: ResponseData = await response.json();
      console.log(data);
      const infoList: RestaurantInfo[] = data.places.map(place => ({
        id: place.id,
        name: place.displayName.text,
        location: place.formattedAddress,
        uri: place.websiteUri ?? ''
      }));
      console.log(infoList);
      setResponse(infoList);
      
    } catch (error) {
      if (error instanceof Error) {
        setError(`Failed to send location data: ${error.message}`);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Discover New Restaurants!</h1>
      <h2>Top Choices</h2>
      <div className='position'>
        {error ? (
          <p>{error}</p>
        ) : loading ? (
          <p>Sending location...</p>
        ) : latitude && longitude ? (
          <div>
            <p>Latitude: {latitude}, Longitude: {longitude}</p>
            {response ? (
              response.map((place, index) => (
                <div key={index}>
                  <h3>Restaurant {index + 1}</h3>
                  <pre>{JSON.stringify(place, null, 2)}</pre>
                </div>
              ))
            ) : (
              <p>No response received</p>
            )}
          </div>
        ) : (
          <p>Loading location...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
