import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaThumbsUp, FaThumbsDown, FaFire } from 'react-icons/fa';
import PropTypes from 'prop-types';
import '../css/HomePageCSS.css';

const Card_FeaturedMovies = ({ movies, navigateToMovie, navigateToReviewForm }) => {
  return (
    <Container className="my-5 d-flex flex-column">
      <h2 className="section-title">
        <span>Películas Más Recomendadas</span>
        <Badge bg="danger" className="ms-2">Popular</Badge>
      </h2>
      <Row className="g-4">
        {movies.map((movie) => (
          <Col key={movie.id} xl={3} lg={3} md={6} sm={6} xs={12}>
            <Card className="review-card h-100">
              <div className="movie-poster-container">
                <Card.Img variant="top" src={movie.image} className="movie-poster" />
                {movie.badgeText && (
                  <div className="popularity-badge">
                    <Badge bg="danger">{movie.badgeText}</Badge>
                  </div>
                )}
                <div className="movie-overlay">
                  <Button variant="danger" size="sm" onClick={() => navigateToReviewForm(movie.id)}>
                    Ver detalles
                  </Button>
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
  );
};

Card_FeaturedMovies.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      likes: PropTypes.number,
      dislikes: PropTypes.number,
      year: PropTypes.number,
      director: PropTypes.string,
      badgeText: PropTypes.string
    })
  ).isRequired,
  navigateToMovie: PropTypes.func,
  navigateToReviewForm: PropTypes.func
};

Card_FeaturedMovies.defaultProps = {
  navigateToMovie: () => {},
  navigateToReviewForm: () => {}
};

export default Card_FeaturedMovies;