import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel, Form, ListGroup, Badge } from 'react-bootstrap';
import { FaComment, FaEdit, FaSearch, FaUser,  FaThumbsUp, FaThumbsDown, FaStar,FaFire, FaCrown} from 'react-icons/fa';
import '../css/HomePageCSS.css';
import Logo2 from '../Images/Logooo.jpg';

export default function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); 

  const handleSearchChange = (e) => {
    setSearch(e.target.value); 
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(search.trim()) {
      //navigate(`/search?query=${encodeURIComponent(search)}`);
      navigate('/result');
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToMovie = (movieId) => {
    //navigate(`/movie/${movieId}`);
    navigate('/movie');
  };

  const navigateToReviewForm = (movieId) => {
    //navigate(`/movies/${movieId}/review/new`);
    navigate('/movie');
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

  return (
    <div className='body-home'>
      <div className="d-flex flex-column min-vh-100">  

        <nav className='navbar navbar-expand-lg navbar-dark bg-dark py-3'>
          <Container>
            <div className='d-flex align-items-center'>
              <img src={Logo2} alt='Logo' className='logo-img me-2' />
              <span className='navbar-brand fw-bold'>PopCorn Review</span>
            </div>

            <Form className="mx-4 flex-grow-1" onSubmit={handleSearchSubmit}>
              <div className="input-group search-container">
                <Form.Control
                  type="text"
                  className="search-input"
                  placeholder="Buscar películas..."
                  value={search}
                  onChange={handleSearchChange}
                />
                <Button variant="danger" type="submit" className="search-button">
                  <FaSearch />
                </Button>
              </div>
            </Form>

            <Button 
              variant="outline-light" 
              onClick={navigateToLogin}
              className="d-flex align-items-center"
            >
              <FaUser className="me-2" />
              Iniciar Sesión
            </Button>
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
                <Button variant="danger">Ver más</Button>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>

       {/* Sección de películas destacadas */}
      <Container className="my-5 d-flex flex-column">
        <h2 className="section-title">
          <span>Películas Más Recomendadas</span>
          <Badge bg="danger" className="ms-2">Popular</Badge>
        </h2>
        <Row className="g-4">
          {[
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
            { 
              id: 2,
              title: "Barbie", 
              image: "https://www.themoviedb.org/t/p/original/8uOVNBDjGYitMvE6eJ7EVDH4plG.jpg", 
              likes: 85, 
              dislikes: 15,
              year: 2023,
              director: "Greta Gerwig"
            },
            { 
              id: 3,
              title: "John Wick 4", 
              image: "https://th.bing.com/th/id/OIP.T35j1g1cY0Q_qtFhW2Yj5wHaLH?rs=1&pid=ImgDetMain", 
              likes: 90, 
              dislikes: 10,
              year: 2023,
              director: "Chad Stahelski"
            },
            { 
              id: 7,
              title: "Dune: Parte Dos", 
              image: "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg", 
              likes: 93, 
              dislikes: 7,
              year: 2024,
              director: "Denis Villeneuve"
            },
            { 
              id: 8,
              title: "The Batman", 
              image: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg", 
              likes: 87, 
              dislikes: 13,
              year: 2022,
              director: "Matt Reeves"
            },
            { 
              id: 9,
              title: "Top Gun: Maverick", 
              image: "https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg", 
              likes: 96, 
              dislikes: 4,
              year: 2022,
              director: "Joseph Kosinski"
            },
            // NUEVAS PELÍCULAS AÑADIDAS
            { 
              id: 13,
              title: "Interstellar", 
              image: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg", 
              likes: 94, 
              dislikes: 6,
              year: 2014,
              director: "Christopher Nolan"
            },
            { 
              id: 14,
              title: "Parásitos", 
              image: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg", 
              likes: 99, 
              dislikes: 1,
              year: 2019,
              director: "Bong Joon-ho"
            }
          ].map((movie) => (
            <Col key={movie.id} xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="review-card h-100">
                <div className="movie-poster-container">
                  <Card.Img variant="top" src={movie.image} className="movie-poster" />
                  <div className="popularity-badge">
                    <Badge bg="danger">{movie.badgeText}</Badge>
                  </div>
                  <div className="movie-overlay">
                    <Button variant="danger" size="sm"  onClick={() => navigateToReviewForm()} >Ver detalles</Button>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="movie-title">{movie.title}</Card.Title>
                  <div className="movie-meta">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.director}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="likes-dislikes">
                      <span className="likes">
                        <FaThumbsUp className="me-1" />
                        {movie.likes}%
                      </span>
                      <span className="dislikes">
                        <FaThumbsDown className="me-1" />
                        {movie.dislikes}%
                      </span>
                    </div>
                    <Badge bg="light" text="dark" className="reactions-count">
                      <FaFire className="me-1" /> Hot
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Sección de películas mejor calificadas */}
      <Container className="my-5 d-flex flex-column">
        <h2 className="section-title">
          <span>Películas Mejor Calificadas</span>
          <Badge bg="warning" text="dark" className="ms-2">Premium</Badge>
        </h2>
        <Row className="g-4">
          {[
            { 
              id: 4,
              title: "El Padrino", 
              image: "https://diariodeunacinefila.files.wordpress.com/2011/09/poster-de-el-padrino.jpg", 
              rating: 5.0,
              year: 1972,
              director: "Francis Ford Coppola",
              badgeText: "Clásico"
            },
            { 
              id: 5,
              title: "Cadena Perpetua", 
              image: "https://images-na.ssl-images-amazon.com/images/S/pv-target-images/810745804007581f523d36ba1e88a3a23e82128539002da8975eaf47c82c7027._RI_V_TTW_.jpg", 
              rating: 4.9,
              year: 1994,
              director: "Frank Darabont"
            },
            { 
              id: 6,
              title: "El Padrino: Parte II", 
              image: "https://images-na.ssl-images-amazon.com/images/S/pv-target-images/aef2c14fa2092344f51a7ed10a3950963648c9d0e3348c683bc7cd5d7f040c8f._RI_V_TTW_.jpg", 
              rating: 4.8,
              year: 1974,
              director: "Francis Ford Coppola"
            },
            { 
              id: 10,
              title: "Pulp Fiction", 
              image: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg", 
              rating: 4.7,
              year: 1994,
              director: "Quentin Tarantino"
            },
            { 
              id: 11,
              title: "El Señor de los Anillos: El Retorno del Rey", 
              image: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg", 
              rating: 4.9,
              year: 2003,
              director: "Peter Jackson"
            },
            { 
              id: 12,
              title: "Forrest Gump", 
              image: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg", 
              rating: 4.8,
              year: 1994,
              director: "Robert Zemeckis"
            },
            // NUEVAS PELÍCULAS AÑADIDAS
            { 
              id: 15,
              title: "La Lista de Schindler", 
              image: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg", 
              rating: 4.9,
              year: 1993,
              director: "Steven Spielberg"
            },
            { 
              id: 16,
              title: "El Caballero de la Noche", 
              image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg", 
              rating: 4.8,
              year: 2008,
              director: "Christopher Nolan"
            }
          ].map((movie) => (
            <Col key={movie.id} xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="review-card h-100">
                <div className="movie-poster-container">
                  <Card.Img variant="top" src={movie.image} className="movie-poster" />
                  <div className="rating-badge">
                    <Badge bg="danger" text="light">{movie.rating.toFixed(1)}</Badge>
                  </div>
                  <div className="classic-badge">
                    <Badge bg="dark">{movie.badgeText}</Badge>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="movie-title">{movie.title}</Card.Title>
                  <div className="movie-meta">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.director}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="star-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(movie.rating) ? "filled" : "empty"} 
                        />
                      ))}
                      <span className="ms-2 rating-value">{movie.rating.toFixed(1)}</span>
                    </div>
                    <Badge bg="danger" text="light" className="premium-badge">
                      <FaCrown className="me-1" /> Top
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

        {/* Sección de Películas con Más Reseñas */}
        <Container className="my-5 d-flex flex-column">
          <h2 className="section-title">
            <span>Películas con Más Reseñas</span>
          </h2>
          <Row className="g-4">
            {[
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
              { 
                id: 18,
                title: "Spider-Man: No Way Home", 
                image: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg", 
                rating: 4.6,
                year: 2021,
                director: "Jon Watts",
                reviews: 9821,
                stars: 4.3
              },
              { 
                id: 19,
                title: "Titanic", 
                image: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg", 
                rating: 4.8,
                year: 1997,
                director: "James Cameron",
                reviews: 8765,
                stars: 4.7
              },
              { 
                id: 20,
                title: "Joker", 
                image: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg", 
                rating: 4.4,
                year: 2019,
                director: "Todd Phillips",
                reviews: 7543,
                stars: 4.2
              }
            ].map((movie) => (
              <Col key={movie.id} xl={3} lg={3} md={6} sm={6} xs={12}>
                <Card className="review-card h-100" onClick={() => navigateToMovie(movie.id)}>
                  <div className="movie-poster-container">
                    <Card.Img variant="top" src={movie.image} className="movie-poster" />
                    <div className="review-badge">
                      {movie.reviews.toLocaleString()} reseñas
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title className="movie-title">{movie.title}</Card.Title>
                    <div className="movie-meta">
                      <span>{movie.year}</span>
                      <span>•</span>
                      <span>{movie.director}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div className="star-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < Math.floor(movie.stars) ? "filled" : "empty"} 
                          />
                        ))}
                        <span className="ms-2 rating-value">{movie.stars.toFixed(1)}</span>
                      </div>
                      <Badge bg="danger" className="reviews-count">
                        <FaComment className="me-1" /> {Math.round(movie.reviews/1000)}k
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        {/* Sección de Películas Recién Agregadas */}
        <Container className="my-5 d-flex flex-column">
          <h2 className="section-title">
            <span>Películas Recién Agregadas</span>
            <span className="badge bg-danger ms-2">¡Nuevas!</span>
          </h2>
          <p className="text-center mb-4">Sé el primero en dejar tu reseña sobre estos estrenos</p>
          
          <Row className="g-4">
            {[
              { 
                id: 21,
                title: "Duna: Parte Dos", 
                image: "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg", 
                year: 2024,
                director: "Denis Villeneuve",
                addedDate: "Hace 3 días",
                hasReview: false
              },
              { 
                id: 22,
                title: "Kung Fu Panda 4", 
                image: "https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUyNy00ZTA2LWIyYTEtMDc5Y2E5ZjJmNGFkXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg", 
                year: 2024,
                director: "Mike Mitchell",
                addedDate: "Hace 1 semana",
                hasReview: false
              },
              { 
                id: 23,
                title: "Civil War", 
                image: "https://m.media-amazon.com/images/M/MV5BNWY0YWFmYzItOGM1YS00ZjBhLTlkZDYtOTMyYjc1YzI5LTIyXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg", 
                year: 2024,
                director: "Alex Garland",
                addedDate: "Hace 5 días",
                hasReview: false
              },
              { 
                id: 24,
                title: "Godzilla y Kong: El Nuevo Imperio", 
                image: "https://m.media-amazon.com/images/M/MV5BZTcxNzgzYjMtNjE3Yi00YjY0LTg1ZTYtOTQ2ZDBjOTE5MmY2XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg", 
                year: 2024,
                director: "Adam Wingard",
                addedDate: "Hace 2 días",
                hasReview: false
              }
            ].map((movie) => (
              <Col key={movie.id} xl={3} lg={3} md={6} sm={6} xs={12}>
                <Card className="new-movie-card h-100">
                  <div className="position-relative">
                    <Card.Img variant="top" src={movie.image} className="movie-poster" />
                    <span className="new-badge bg-danger">Nuevo</span>
                    <span className="date-badge bg-dark">{movie.addedDate}</span>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <br />
                    <Card.Title className="movie-title">{movie.title}</Card.Title>
                    <div className="movie-meta mb-3">
                      <span>{movie.year}</span>
                      <span>•</span>
                      <span>{movie.director}</span>
                    </div>
                    
                    {!movie.hasReview ? (
                      <Button 
                        variant="outline-danger" 
                        className="mt-auto review-button"
                        onClick={() => navigateToReviewForm(movie.id)}
                      >
                        <FaEdit className="me-2" />
                        Crear Primera Reseña
                      </Button>
                    ) : (
                      <Button variant="outline-secondary" disabled>
                        Ya tienes una reseña
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        {/* Sección de recomendaciones */}
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

        {/* Footer mejorado */}
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