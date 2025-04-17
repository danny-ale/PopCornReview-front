import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import PropTypes from 'prop-types';
import '../css/HomePageCSS.css';

const Card_NewlyMovies = ({ movies, navigateToMovie }) => {
  return (
    <Container className="my-5 d-flex flex-column">
      <h2 className="section-title">
        <span>Películas Recién Agregadas</span>
        <span className="badge bg-danger ms-2">¡Nuevas!</span>
      </h2>
      <p className="text-center mb-4">Sé el primero en dejar tu reseña sobre estos estrenos</p>
      
      <Row className="g-4">
        {movies.map((movie) => (
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
                    onClick={() => navigateToMovie(movie.id)}
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
  );
};

Card_NewlyMovies.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      year: PropTypes.number,
      director: PropTypes.string,
      addedDate: PropTypes.string.isRequired,
      hasReview: PropTypes.bool
    })
  ).isRequired,
  navigateToMovie: PropTypes.func
};

Card_NewlyMovies.defaultProps = {
  navigateToMovie: () => {},
  movies: []
};

export default Card_NewlyMovies;