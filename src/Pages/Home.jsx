import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Carousel,Spinner, Form, ListGroup, Dropdown, NavDropdown } from 'react-bootstrap';
import { FaSearch, FaUser, FaSignOutAlt, FaFilm, FaTags, FaStar } from 'react-icons/fa';
import '../css/HomePageCSS.css';
import Logo2 from '../Images/Logooo.jpg';
import FeaturedMovies from '../Components/Card_FeaturedMovies';
import TopRatedMovies from '../Components/Card_TopRatedMovies';
import MostReviewedMovies from '../Components/Card_MostReviewMovie';
import NewlyAddedMovies from '../Components/Card_NewlyMovies';

export default function Home() {
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [mostReviewedMovies, setMostReviewedMovies] = useState([]);
  const [newlyAddedMovies, setNewlyAddedMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulando llamada a la API
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        // En una aplicación real, aquí harías fetch a tu API
        // const response = await fetch('tu-api-endpoint');
        // const data = await response.json();
        
        // Datos de ejemplo (simulando respuesta de API)
        const mockData = {
          featured: [
            { 
              id: 1,
              title: "Oppenheimer", 
              image: "https://www.eyeforfilm.co.uk/images/stills/o/oppenheimer_2023_poster.jpg", 
              likes: 95, 
              dislikes: 5,
              year: 2023,
              director: "Christopher Nolan",
              badgeText: "Top 1"
            },
            // ... otros datos de películas destacadas
          ],
          topRated: [
            { 
              id: 4,
              title: "El Padrino", 
              image: "https://diariodeunacinefila.files.wordpress.com/2011/09/poster-de-el-padrino.jpg", 
              rating: 5.0,
              year: 1972,
              director: "Francis Ford Coppola",
              badgeText: "Clásico"
            },
            // ... otros datos de películas mejor calificadas
          ],
          mostReviewed: [
            { 
              id: 17,
              title: "Avengers: Endgame", 
              image: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg", 
              rating: 4.7,
              year: 2019,
              director: "Hermanos Russo",
              reviews: 12543,
              stars: 4.5
            },
            // ... otros datos de películas con más reseñas
          ],
          newlyAdded: [
            { 
              id: 21,
              title: "Duna: Parte Dos", 
              image: "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg", 
              year: 2024,
              director: "Denis Villeneuve",
              addedDate: "Hace 3 días",
              hasReview: false
            },
            // ... otros datos de películas recién agregadas
          ]
        };

        setFeaturedMovies(mockData.featured);
        setTopRatedMovies(mockData.topRated);
        setMostReviewedMovies(mockData.mostReviewed);
        setNewlyAddedMovies(mockData.newlyAdded);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value); 
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(search.trim()) {
      navigate('/result');
    }
  };

  const navigateToMovie = (movieId) => {
    //navigate(`/movie/${movieId}`);
    navigate('/movie');

  };

  const navigateToReviewForm = (movieId) => {
    //navigate(`/movies/${movieId}/review/new`);
    navigate('/movie');

  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/login');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const recommendedMovies = [
    { title: "Oppenheimer", rating: 4.5 },
    { title: "Barbie", rating: 4.0 },
    { title: "John Wick 4", rating: 4.8 },
    { title: "Avatar: El Camino del Agua", rating: 4.3 },
    { title: "Guardians of the Galaxy Vol. 3", rating: 4.6 }
  ];

const carouselItems = [
  {
    title: "Los Oscar 2025: ¡Los nominados ya están aquí!",
    description: "Descubre quiénes compiten por la estatuilla dorada este año.",
    image: "https://i.pinimg.com/736x/b2/7a/6a/b27a6a991d882c0c5b9a249d02cb6382.jpg"
  },
  {
    title: "Oppenheimer gana el premio a Mejor Película",
    description: "La película de Christopher Nolan se lleva el máximo galardón.",
    image: "https://i.pinimg.com/736x/b2/7a/6a/b27a6a991d882c0c5b9a249d02cb6382.jpg"
  },
  {
    title: "Cillian Murphy: Mejor Actor en los Oscar 2025",
    description: "El actor irlandés se consagra con una actuación inolvidable.",
    image: "https://i.pinimg.com/736x/b2/7a/6a/b27a6a991d882c0c5b9a249d02cb6382.jpg"
  }
];



  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <div className='body-home'>
      <div className="d-flex flex-column min-vh-100">  
       
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark py-3'>
          <Container>
            <div className='d-flex align-items-center'>
              <img src={Logo2} alt='Logo' className='logo-img me-2' />
              <span 
                className='navbar-brand fw-bold cursor-pointer' 
                onClick={() => navigate('/')}
              >
                PopCorn Review
              </span>
            </div>

            <Form className="mx-4 flex-grow-1" onSubmit={handleSearchSubmit}>
              <div className="input-group search-container">
                <Form.Control
                  type="text"
                  className="search-input"
                  placeholder="Buscar películas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="danger" type="submit" className="search-button">
                  <FaSearch />
                </Button>
              </div>
            </Form>

            {isLoggedIn ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="dark" id="dropdown-user">
                  <div className="d-flex align-items-center">
                    <FaUser className="me-2" />
                    <span>Mi Perfil</span>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-dark">
                  <Dropdown.Item onClick={() => navigate('/Perfil')}>
                    <div className="d-flex align-items-center">
                      <FaUser className="me-2" />
                      Ver Perfil
                    </div>
                  </Dropdown.Item>
                  
                  <Dropdown.Divider />
                  
                  <NavDropdown title="Crear" id="create-dropdown" className="dropdown-submenu">
                    <Dropdown.Item onClick={() => navigate('/CrearPelicula')}>
                      <div className="d-flex align-items-center">
                        <FaFilm className="me-2" />
                        Nueva Película
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate('/CrearCategoria')}>
                      <div className="d-flex align-items-center">
                        <FaTags className="me-2" />
                        Nueva Categoría
                      </div>
                    </Dropdown.Item>
                  </NavDropdown>
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item onClick={handleLogout}>
                    <div className="d-flex align-items-center text-danger">
                      <FaSignOutAlt className="me-2" />
                      Cerrar Sesión
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button 
                variant="outline-light" 
                onClick={handleLogin}
                className="d-flex align-items-center"
              >
                <FaUser className="me-2" />
                Iniciar Sesión
              </Button>
            )}
          </Container>
        </nav>

        <Carousel fade className="hero-carousel">
          {carouselItems.map((item, index) => (
            <Carousel.Item key={index}>
              <div 
                className="carousel-image"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <Carousel.Caption className="carousel-caption">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>

        
        {featuredMovies.length > 0 && (
          <FeaturedMovies 
            movies={featuredMovies} 
            navigateToMovie={navigateToMovie}
            navigateToReviewForm={navigateToReviewForm}
          />
        )}

        {topRatedMovies.length > 0 && (
          <TopRatedMovies 
            movies={topRatedMovies} 
            navigateToMovie={navigateToMovie}
            navigateToReviewForm={navigateToReviewForm}
          />
        )}

        {mostReviewedMovies.length > 0 && (
          <MostReviewedMovies 
            movies={mostReviewedMovies} 
            navigateToMovie={navigateToMovie}
            navigateToReviewForm={navigateToReviewForm}
          />
        )}

        {newlyAddedMovies.length > 0 && (
          <NewlyAddedMovies 
            movies={newlyAddedMovies} 
            navigateToMovie={navigateToMovie}
            navigateToReviewForm={navigateToReviewForm}
          />
        )}

        <Container className="my-5 d-flex flex-column">
          <h2 className="section-title">
            <span>Películas Que Te Pueden Gustar</span>
          </h2>
          <ListGroup className="recommendations-list">
            {recommendedMovies.map((movie, index) => (
              <ListGroup.Item 
                key={index} 
                className="recommendation-item"
                action
                onClick={() => navigateToMovie(movie.id || index + 7)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span className="recommendation-title">
                    {index + 1}. {movie.title}
                  </span>
                  <div className="d-flex align-items-center">
                    <div className="star-rating small">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(movie.rating) ? "filled" : "empty"} 
                        />
                      ))}
                    </div>
                    <span className="rating-value ms-2">{movie.rating.toFixed(1)}</span>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>

        <footer className="footer mt-auto py-4 bg-dark text-center">
          <Container>
            <p className="mb-0">&copy; 2025 PopCorn Reviews - Todos los derechos reservados.</p>
            <div className="footer-links mt-2">
              <a href="/about">Acerca de</a>
              <a href="/contact">Contacto</a>
              <a href="/privacy">Privacidad</a>
              <a href="/terms">Términos</a>
            </div>
          </Container>
        </footer>


      </div>
    </div>
  );
}