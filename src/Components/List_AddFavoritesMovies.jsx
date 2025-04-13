import React from 'react';
import PropTypes from 'prop-types';
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import defaultMovieImg from '../Images/pelicula.jpg';
import '../css/ListaReview.css';

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

const List_FavoritesMovies = ({ favorites, onDeleteFavorite }) => {
  return (
    <section className="favorites-section">
      <div className="section-header">
        <h2><FaHeart className="section-icon" /> Películas Favoritas</h2>
        <span className="count-badge">{favorites.length} películas</span>
      </div>
      
      <div className="movies-grid">
        {favorites.map(movie => (
          <div key={movie.id} className="movie-card">
            <div className="movie-poster-container">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="movie-poster"
                onError={(e) => {
                  e.target.src = defaultMovieImg;
                }}
              />
              <button 
                className="favorite-btn active"
                onClick={() => onDeleteFavorite('favorites', movie.id)}
              >
                <FaHeart />
              </button>
              <div className="user-rating">
                {renderStars(movie.userRating)}
              </div>
            </div>
            <div className="movie-details">
              <h3 className="movie-title">{movie.title} ({movie.year})</h3>
              <p className="movie-meta">
                {movie.director} • {movie.runtime} min • {movie.rating}
              </p>
              <div className="movie-genres">
                {movie.genres.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre}</span>
                ))}
              </div>
              <p className="added-date">Agregada: {formatDate(movie.addedDate)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

List_FavoritesMovies.propTypes = {
  favorites: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      poster: PropTypes.string,
      year: PropTypes.number.isRequired,
      director: PropTypes.string.isRequired,
      runtime: PropTypes.number.isRequired,
      rating: PropTypes.string.isRequired,
      genres: PropTypes.arrayOf(PropTypes.string).isRequired,
      userRating: PropTypes.number.isRequired,
      addedDate: PropTypes.string.isRequired
    })
  ).isRequired,
  onDeleteFavorite: PropTypes.func.isRequired
};

export default List_FavoritesMovies;