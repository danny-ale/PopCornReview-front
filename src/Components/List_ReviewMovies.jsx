import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import defaultMovieImg from '../Images/pelicula.jpg';
import '../css/ListaReview.css';

const List_ReviewsMovies = ({ reviews, onEditReview, onDeleteReview }) => {
  const [editingReview, setEditingReview] = useState(null);
  const [editedReviewText, setEditedReviewText] = useState('');

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star half-filled" />);
      } else {
        stars.push(<FaRegStar key={i} className="star" />);
      }
    }
    
    return stars;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditClick = (review) => {
    setEditingReview(review.id);
    setEditedReviewText(review.review);
    //onEditReview(review);
  };

  const handleSave = (id) => {
    onEditReview({ id, review: editedReviewText });
    setEditingReview(null);
  };

  return (
    <section className="reviews-section">
      <div className="section-header">
        <h2><FaEdit className="section-icon" /> Reseñas Recientes</h2>
        <span className="count-badge">{reviews.length} reseñas</span>
      </div>
      
      {reviews.map(movie => (
        <div key={movie.id} className="review-card">
          <div className="review-header">
            <div className="movie-poster-small">
              <img 
                src={movie.poster} 
                alt={movie.title}
                onError={(e) => {
                  e.target.src = defaultMovieImg;
                }}
              />
            </div>
            <div className="review-movie-info">
              <h3 className="movie-title">{movie.title} ({movie.year})</h3>
              <p className="movie-meta">
                {movie.director} • {movie.runtime} min • {movie.rating}
              </p>
              <div className="user-rating">
                {renderStars(movie.userRating)}
                <span className="review-date">{formatDate(movie.reviewDate)}</span>
              </div>
            </div>
          </div>
          <div className="review-content">
            {editingReview === movie.id ? (
              <>
                <textarea
                  className="edit-review-textarea"
                  value={editedReviewText}
                  onChange={(e) => setEditedReviewText(e.target.value)}
                  rows="4"
                />
                <div className="review-edit-actions">
                  <button 
                    className="action-btn save-btn"
                    onClick={() => handleSave(movie.id)}
                  >
                    Guardar
                  </button>
                  <button 
                    className="action-btn cancel-btn"
                    onClick={() => setEditingReview(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <p>{movie.review}</p>
            )}
          </div>
          {editingReview !== movie.id && (
            <div className="review-actions">
              <button 
                className="action-btn edit-btn"
                onClick={() => handleEditClick(movie)}
              >
                <FaEdit /> Editar
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={() => onDeleteReview('reviews', movie.id)}
              >
                <FaTrash /> Eliminar
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

List_ReviewsMovies.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      poster: PropTypes.string,
      year: PropTypes.number.isRequired,
      director: PropTypes.string.isRequired,
      runtime: PropTypes.number.isRequired,
      rating: PropTypes.string.isRequired,
      review: PropTypes.string.isRequired,
      userRating: PropTypes.number.isRequired,
      reviewDate: PropTypes.string.isRequired
    })
  ).isRequired,
  onEditReview: PropTypes.func.isRequired,
  onDeleteReview: PropTypes.func.isRequired
};

export default List_ReviewsMovies;