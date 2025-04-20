import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Badge, Pagination, Dropdown, NavDropdown } from 'react-bootstrap';
import { FaSearch, FaUser, FaThumbsUp, FaThumbsDown, FaFire, FaTags, FaFilm, FaSignOutAlt, FaSort, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import Logo2 from '../Images/Logooo.jpg';
import '../css/HomePageCSS.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";


export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [sortOption, setSortOption] = useState('Puntuacion_Media');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [movies, setMovies] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = new URLSearchParams(location.search);
  const query = params.get("query") || "";

  const searchMovies = async (searchQuery, sortBy, sortDir, page, limit) => {
    setIsLoading(true);
    setError(null);
    
    try {

      const params = new URLSearchParams({
        query: searchQuery || '',
        sortBy,
        sortDirection: sortDir,
        page,
        limit
      });

      const response = await fetch(`http://localhost:3001/popCornReview/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseData = await response.json(); 
      const data = responseData.data;

      if (!response.ok) {
        throw new Error(data.message || 'Error al buscar películas');
      }

      if (!data || !Array.isArray(data.movies)) {
        throw new Error('La respuesta no tiene el formato esperado');
      }

      const mappedMovies = data.movies.map(movie => ({
        id: movie.Id,
        title: movie.Titulo,
        image: movie.Portada ? `data:image/jpeg;base64,${movie.Portada}` : 'https://via.placeholder.com/300x450',
        likes: movie.Porcentaje_Pos || 0,
        dislikes: movie.Porcentaje_Neg || 0,
        year: movie.year,
        director: movie.Director,
        rating: parseFloat(movie.rating) || 0
      }));

      setMovies(mappedMovies);
      setTotalMovies(data.total);
    } catch (error) {
      console.error('Error al buscar películas:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchMovies(query, sortOption, sortDirection, currentPage, itemsPerPage);
  }, [query, sortOption, sortDirection, currentPage, itemsPerPage]);


  const getSortOption = (option) => {
    switch(option) {
      case 'title': return 'Titulo';
      case 'year': return 'Año_Lanzamiento';
      case 'rating': return 'Puntuacion_Media';
      case 'likes': return 'Porcentaje_Pos';
      default: return 'Puntuacion_Media';
    }
  };

  const handleSort = (option) => {
    const backendOption = getSortOption(option);
    if (sortOption === backendOption) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortOption(backendOption);
      setSortDirection('DESC');
    }
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.search.value;
    if (searchInput.trim()) {
      navigate(`/result?query=${encodeURIComponent(searchInput)}`);
      setCurrentPage(1);
    }
  };

  const navigateToReviewForm = (movieId) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData?.userId;
    if(userId==null){
      navigate('/login');
      return;
    }
    navigate(`/movie/${userId}/${movieId}`);

  };
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    navigate('/');
    toast.success('Has cerrado sesión correctamente', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
  });
  };


  const renderPagination = () => {
    const totalPages = Math.ceil(totalMovies / itemsPerPage);
    if (totalPages <= 1) return null;

    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
        />
        {items}
        <Pagination.Next 
          disabled={currentPage === totalPages} 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
        />
      </Pagination>
    );
  };

  const getFrontendSortOption = (backendOption) => {
    switch(backendOption) {
      case 'Titulo': return 'title';
      case 'Año_Lanzamiento': return 'year';
      case 'Puntuacion_Media': return 'rating';
      case 'Porcentaje_Pos': return 'likes';
      default: return 'rating';
    }
  };

  if (isLoading) {
    return (
      <div className="body-home">
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark py-3'>
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
                name="search"
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

          {localStorage.getItem('token') ? (
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
        </nav>
        <Container className="my-5 d-flex justify-content-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="body-home">
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
                name="search"
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
        <Container className="my-5 d-flex justify-content-center">
          <div className="alert alert-danger">
            Error al cargar películas: {error}
          </div>
        </Container>
      </div>
    );
  }

  const frontendSortOption = getFrontendSortOption(sortOption);

  return (
    <div className="body-home">
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
                name="search"
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

      <Container className="my-5 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">
            Resultados para: <strong>"{query}"</strong>
          </h2>
          
          <Dropdown>
            <Dropdown.Toggle variant="outline-light" id="dropdown-sort">
              <FaSort className="me-2" />
              Ordenar por: {frontendSortOption === 'title' ? 'Título' : 
                           frontendSortOption === 'year' ? 'Año' : 
                           frontendSortOption === 'rating' ? 'Rating' : 
                           frontendSortOption === 'likes' ? 'Likes' : 'Relevancia'}
              {sortDirection === 'ASC' ? <FaSortAmountUp className="ms-2" /> : <FaSortAmountDown className="ms-2" />}
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-dark">
              <Dropdown.ItemText className="text-muted">Ordenar por:</Dropdown.ItemText>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => handleSort('title')} active={sortOption === 'Titulo'}>
                Título
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('year')} active={sortOption === 'Año_Lanzamiento'}>
                Año
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('rating')} active={sortOption === 'Puntuacion_Media'}>
                Rating
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('likes')} active={sortOption === 'Porcentaje_Pos'}>
                Likes
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Row className="g-4 mt-3">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <Col key={movie.id} xl={3} lg={4} md={6} sm={6} xs={12}>
                <Card className="review-card h-100">
                  <div className="movie-poster-container">
                    <Card.Img variant="top" src={movie.image} className="movie-poster" />
                    <div className="movie-overlay">
                      <Button variant="danger" size="sm" onClick={() => navigateToReviewForm(movie.id)}>
                        Ver detalles
                      </Button>
                    </div>
                    <Badge bg="danger" className="rating-badge">
                    {Number(movie.rating).toFixed(1)}
                    </Badge>
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
                          <FaThumbsUp className="me-1" />{movie.likes}%
                        </span>
                        <span className="dislikes">
                          <FaThumbsDown className="me-1" />{movie.dislikes}%
                        </span>
                      </div>
                      <Badge bg="light" text="dark" className="reactions-count">
                        <FaFire className="me-1" /> Hot
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>No se encontraron películas con ese nombre.</p>
            </Col>
          )}
        </Row>

        {renderPagination()}
      </Container>
    </div>
  );
}