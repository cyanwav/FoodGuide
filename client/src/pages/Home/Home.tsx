import React, { useState, useEffect } from 'react';
import './css/styles.css';
import { portfolioItems } from './portfolioItems';

interface RestaurantInfo {
    id: string;
    name: string;
    location: string;
    uri: string;
    img: string;
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
        uri: place.websiteUri ?? '',
        img: '' // ! change it later
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
        <div id="page-top">
            {/* Navigation */}
            <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
                <div className="container">
                    <a className="navbar-brand" href="#page-top">
                        <img src="assets/img/navbar-logo2.svg" alt="FoodGuide Logo" />
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarResponsive"
                        aria-controls="navbarResponsive"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        Menu
                        <i className="fas fa-bars ms-1"></i>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="#portfolio">Explore</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Masthead */}
            <header className="masthead">
                <div className="container">
                    <div className="masthead-subheading">Welcome To FoodGuide</div>
                    <div className="masthead-heading text-uppercase">Discover New Restaurants!</div>
                    <a className="btn btn-primary btn-xl text-uppercase" href="#services">Tell Me More</a>
                </div>
            </header>

            {/* Portfolio Grid */}
            <section className="page-section bg-light" id="portfolio">
                <div className="container">
                    <div className="text-center">
                        <h2 className="section-heading text-uppercase">Nearby Choices</h2>
                        <h3 className="section-subheading text-muted">Explore top-rated restaurants near you.</h3>
                    </div>
                    <div className='location'>
                        {error ? (
                        <p>{error}</p>
                        ) : loading ? (
                        <p>Sending location...</p>
                        ) : latitude && longitude ? (
                        <div>
                            <p>Latitude: {latitude}, Longitude: {longitude}</p>
                            {/* {response ? (
                            response.map((place, index) => (
                                <div key={index}>
                                <h3>Restaurant {index + 1}</h3>
                                <pre>{JSON.stringify(place, null, 2)}</pre>
                                </div>
                            ))
                            ) : (
                            <p>No response received</p>
                            )} */}
                        </div>
                        ) : (
                        <p>Loading location...</p>
                        )}
                    </div>
                    <div className="row">
                        {response?.map((place, index) => (
                            <div className="col-lg-4 col-sm-6 mb-4" key={index}>
                                <div className="portfolio-item">
                                    <a className="portfolio-link" data-bs-toggle="modal" href={`#portfolioModal${index + 1}`}>
                                        <div className="portfolio-hover">
                                            <div className="portfolio-hover-content"><i className="fas fa-plus fa-3x"></i></div>
                                        </div>
                                        <img className="img-fluid" src={place.img} alt={place.name} />
                                    </a>
                                    <div className="portfolio-caption">
                                        <div className="portfolio-caption-heading">{place.name}</div>
                                        <div className="portfolio-caption-subheading text-muted">{place.id}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* {
                            portfolioItems.map((item, index) => (
                                <div className="col-lg-4 col-sm-6 mb-4" key={index}>
                                    <div className="portfolio-item">
                                        <a className="portfolio-link" data-bs-toggle="modal" href={`#portfolioModal${index + 1}`}>
                                            <div className="portfolio-hover">
                                                <div className="portfolio-hover-content"><i className="fas fa-plus fa-3x"></i></div>
                                            </div>
                                            <img className="img-fluid" src={item.img} alt={item.alt} />
                                        </a>
                                        <div className="portfolio-caption">
                                            <div className="portfolio-caption-heading">{item.heading}</div>
                                            <div className="portfolio-caption-subheading text-muted">{item.subheading}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        } */}
                        
                    
                        {/* {portfolioItems.map((item, index) => (
                            <div className="col-lg-4 col-sm-6 mb-4" key={index}>
                                <div className="portfolio-item">
                                    <a className="portfolio-link" data-bs-toggle="modal" href={`#portfolioModal${index + 1}`}>
                                        <div className="portfolio-hover">
                                            <div className="portfolio-hover-content"><i className="fas fa-plus fa-3x"></i></div>
                                        </div>
                                        <img className="img-fluid" src={item.img} alt={item.alt} />
                                    </a>
                                    <div className="portfolio-caption">
                                        <div className="portfolio-caption-heading">{item.heading}</div>
                                        <div className="portfolio-caption-subheading text-muted">{item.subheading}</div>
                                    </div>
                                </div>
                            </div>
                        ))} */}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer py-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-4 text-lg-start">Copyright &copy; Your Website 2023</div>
                    </div>
                </div>
            </footer>

            {/* Portfolio Modals */}
            {portfolioItems.map((item, index) => (
                <div className="portfolio-modal modal fade" id={`portfolioModal${index + 1}`} tabIndex={-1} role="dialog" aria-hidden="true" key={index}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="close-modal" data-bs-dismiss="modal">
                                <img src="assets/img/close-icon.svg" alt="Close modal" />
                            </div>
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-lg-8">
                                        <div className="modal-body">
                                            {/* Project details */}
                                            <h2 className="text-uppercase">{item.heading}</h2>
                                            <p className="item-intro text-muted">{item.intro}</p>
                                            <img className="img-fluid d-block mx-auto" src={item.img} alt={item.alt} />
                                            <p>{item.description}</p>
                                            <ul className="list-inline">
                                                <li>
                                                    <strong>Client:</strong> {item.client}
                                                </li>
                                                <li>
                                                    <strong>Category:</strong> {item.category}
                                                </li>
                                            </ul>
                                            <button className="btn btn-primary btn-xl text-uppercase" data-bs-dismiss="modal" type="button">
                                                <i className="fas fa-xmark me-1"></i>
                                                Close Project
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Bootstrap core JS */}
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
        </div>
    );
};

export default Home;
