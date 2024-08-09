import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
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

  return (
    <div className={styles.container}>
      <h1>Discover New Restaurants!</h1>
      <h2>Top Choices</h2>
      <div className='position'>
        {error ? (
          <p>{error}</p>
        ) : latitude && longitude ? (
          <p>Latitude: {latitude}, Longitude: {longitude}</p>
        ) : (
          <p>Loading location...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
