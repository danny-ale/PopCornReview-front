import React from 'react';
import PropTypes from 'prop-types';
import { 
  Table, 
  Button, 
  ButtonGroup,
  Badge,
  Image,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaClock, 
  FaStar, 
  FaTheaterMasks, 
  FaInfoCircle,
  FaYoutube
} from 'react-icons/fa';
import defaultMovieImg from '../Images/pelicula.jpg';

const List_AddMovies = ({ movies, onEditMovie, onDeleteMovie, navigateToCreateMovie }) => {
  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">
      {text}
    </Tooltip>
  );

  return (
    <section className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <FaTheaterMasks className="me-2" /> 
          Películas Agregadas
        </h2>
         <button 
            className="add-category-btn" 
            onClick={navigateToCreateMovie}
          >
          <FaPlus /> Nueva Película
          </button>
      </div>
      
      <div className="table-responsive">
        <Table striped bordered hover variant="dark" className="align-middle">
          <thead>
            <tr>
              <th>Película</th>
              <th>Año</th>
              <th>Duración</th>
              <th>Clasificación</th>
              <th>Director</th>
              <th className="d-none d-lg-table-cell">Reparto</th>
              <th className="d-none d-xl-table-cell">Sinopsis</th>
              <th className="d-none d-md-table-cell">Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <Image 
                      src={movie.poster || defaultMovieImg} 
                      alt={movie.title}
                      width={40}
                      height={60}
                      className="me-3 object-fit-cover"
                      onError={(e) => {
                        e.target.src = defaultMovieImg;
                      }}
                      rounded
                    />
                    <div>
                      <div className="fw-bold">{movie.title}</div>
                      <small className="text-muted d-block d-xl-none">
                        <FaInfoCircle className="me-1" />
                        {movie.synopsis?.substring(0, 30)}...
                      </small>
                    </div>
                  </div>
                </td>
                <td>{movie.year}</td>
                <td>
                  <FaClock className="me-1" />
                  {movie.duration} min
                </td>
                <td>
                  <Badge bg="danger" text="light">
                    <FaStar className="me-1" />
                    {movie.rating}
                  </Badge>
                </td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip(movie.director)}
                  >
                    <span className="text-truncate d-inline-block" style={{maxWidth: '100px'}}>
                      {movie.director}
                    </span>
                  </OverlayTrigger>
                </td>
                <td className="d-none d-lg-table-cell">
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip(movie.cast)}
                  >
                    <span className="text-truncate d-inline-block" style={{maxWidth: '150px'}}>
                      {movie.cast?.split(',').slice(0, 2).join(', ')}...
                    </span>
                  </OverlayTrigger>
                </td>
                <td className="d-none d-xl-table-cell">
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip(movie.synopsis)}
                  >
                    <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}}>
                      {movie.synopsis?.substring(0, 50)}...
                    </span>
                  </OverlayTrigger>
                </td>
                <td className="d-none d-md-table-cell">
                  <Badge bg="Dark">
                    {movie.category}
                  </Badge>
                </td>
                <td>
                <ButtonGroup size="sm">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="edit-tooltip">Editar película</Tooltip>}
                  >
                    <Button 
                      variant="warning" 
                      onClick={() => onEditMovie(movie)}
                    >
                      <FaEdit />
                    </Button>
                  </OverlayTrigger>
                  
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="delete-tooltip">Eliminar película</Tooltip>}
                  >
                    <Button 
                      variant="danger" 
                      onClick={() => onDeleteMovie('addedMovies', movie.id)}
                    >
                      <FaTrash />
                    </Button>
                  </OverlayTrigger>
                  
                  {movie.trailer && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="trailer-tooltip">Ver tráiler en YouTube</Tooltip>}
                    >
                      <Button 
                        variant="primary" 
                        href={movie.trailer} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FaYoutube />
                      </Button>
                    </OverlayTrigger>
                  )}
                </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </section>
  );
};

List_AddMovies.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      year: PropTypes.number,
      duration: PropTypes.number,
      rating: PropTypes.string,
      director: PropTypes.string,
      cast: PropTypes.string,
      synopsis: PropTypes.string,
      poster: PropTypes.string,
      trailer: PropTypes.string,
      category: PropTypes.string
    })
  ).isRequired,
  onEditMovie: PropTypes.func.isRequired,
  onDeleteMovie: PropTypes.func.isRequired,
  navigateToCreateMovie: PropTypes.func.isRequired
};

export default List_AddMovies;