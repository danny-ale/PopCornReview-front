import React from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import defaultMovieImg from '../Images/pelicula.jpg';
import '../css/ListaReview.css';

const List_AddMovies = ({ movies, onEditMovie, onDeleteMovie, navigateToCreateMovie }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section className="added-movies-section">
      <div className="section-header">
        <h2><FaPlus className="section-icon" /> Películas Agregadas</h2>
        <div>
          <button className="add-category-btn" onClick={navigateToCreateMovie}>
            <FaPlus /> Agregar Pelicula
          </button>
        </div>
      </div>
      
      <div className="movies-table">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell">Película</div>
            <div className="table-cell">Año</div>
            <div className="table-cell">Director</div>
            <div className="table-cell">Fecha de agregado</div>
            <div className="table-cell">Acciones</div>
          </div>
        </div>
        <div className="table-body">
          {movies.map(movie => (
            <div key={movie.id} className="table-row">
              <div className="table-cell movie-title-cell">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="table-movie-poster"
                  onError={(e) => {
                    e.target.src = defaultMovieImg;
                  }}
                />
                <span>{movie.title}</span>
              </div>
              <div className="table-cell">{movie.year}</div>
              <div className="table-cell">{movie.director}</div>
              <div className="table-cell">{formatDate(movie.addedDate)}</div>
              <div className="table-cell actions-cell d-flex flex-column">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => onEditMovie(movie)}
                >
                  <FaEdit /> Editar
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => onDeleteMovie('addedMovies', movie.id)}
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

List_AddMovies.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      poster: PropTypes.string,
      year: PropTypes.number,
      director: PropTypes.string,
      addedDate: PropTypes.string.isRequired
    })
  ).isRequired,
  onEditMovie: PropTypes.func.isRequired,
  onDeleteMovie: PropTypes.func.isRequired,
  navigateToCreateMovie: PropTypes.func.isRequired
};

export default List_AddMovies;