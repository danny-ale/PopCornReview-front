import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaStar, FaCrown } from 'react-icons/fa';
import PropTypes from 'prop-types';
import '../css/HomePageCSS.css';

const Card_TopRatedMovies = ({ movies, navigateToMovie, navigateToReviewForm }) => {
  return (
    <Container className="my-5 d-flex flex-column">
      <h2 className="section-title">
        <span>Películas Mejor Calificadas</span>
        <Badge bg="warning" text="dark" className="ms-2">Premium</Badge>
      </h2>
      <Row className="g-4">
        {movies.map((movie) => (
          <Col key={movie.id} xl={3} lg={3} md={6} sm={6} xs={12}>
            <Card className="review-card h-100" onClick={() => navigateToMovie(movie.id)}>
              <div className="movie-poster-container">
                <Card.Img variant="top" src={movie.image} className="movie-poster" />
                <div className="rating-badge">
                  <Badge bg="danger" text="light">{movie.rating.toFixed(1)}</Badge>
                </div>
                {movie.badgeText && (
                  <div className="classic-badge">
                    <Badge bg="dark">{movie.badgeText}</Badge>
                  </div>
                )}
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
  );
};

Card_TopRatedMovies.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      year: PropTypes.number,
      director: PropTypes.string,
      badgeText: PropTypes.string
    })
  ).isRequired,
  navigateToMovie: PropTypes.func,
  navigateToReviewForm: PropTypes.func
};

Card_TopRatedMovies.defaultProps = {
  navigateToMovie: () => {},
  navigateToReviewForm: () => {}
};

export default Card_TopRatedMovies;