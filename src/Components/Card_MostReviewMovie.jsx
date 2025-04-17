import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaStar, FaComment } from 'react-icons/fa';
import PropTypes from 'prop-types';
import '../css/HomePageCSS.css';

const Card_MostReviewMovie = ({ movies, navigateToMovie, navigateToReviewForm }) => {
  // Función para manejar valores seguros
  const getSafeValue = (value, defaultValue = 0) => {
    return value !== undefined && value !== null ? value : defaultValue;
  };

  return (
    <Container className="my-5 d-flex flex-column">
      <h2 className="section-title">
        <span>Películas con Más Reseñas</span>
      </h2>
      <Row className="g-4">
        {movies.map((movie) => {
          const rating = parseFloat(getSafeValue(movie.rating, 0));
          const reviews = parseInt(getSafeValue(movie.reviews, 0));
          const image = movie.image ? `data:image/jpeg;base64,${movie.image}` : 'placeholder-image-url';

          return (
            <Col key={movie.Id} xl={3} lg={3} md={6} sm={6} xs={12}>
              <Card className="review-card h-100" onClick={() => navigateToMovie(movie.id)}>
                <div className="movie-poster-container">
                  <Card.Img 
                    variant="top" 
                    src={movie.image} 
                    className="movie-poster"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                    }}
                  />
                  <div className="review-badge">
                    {reviews.toLocaleString()} reseñas
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="movie-title">{movie.title}</Card.Title>
                  <div className="movie-meta">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.director || 'Director no disponible'}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="star-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(rating) ? "filled" : "empty"} 
                        />
                      ))}
                      <span className="ms-2 rating-value">
                        {!isNaN(rating) ? rating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <Badge bg="danger" className="reviews-count">
                      <FaComment className="me-1" /> {Math.round(reviews)}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

Card_MostReviewMovie.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      Titulo: PropTypes.string.isRequired,
      Portada: PropTypes.any,
      Año_Lanzamiento: PropTypes.number,
      Director: PropTypes.string,
      Total_Reseñas: PropTypes.number,
      Promedio_Estrellas: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    })
  ).isRequired,
  navigateToMovie: PropTypes.func,
  navigateToReviewForm: PropTypes.func
};

Card_MostReviewMovie.defaultProps = {
  navigateToMovie: () => {},
  navigateToReviewForm: () => {},
  movies: []
};

export default Card_MostReviewMovie;