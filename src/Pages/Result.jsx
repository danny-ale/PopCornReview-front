import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Badge, Pagination, Dropdown, NavDropdown } from 'react-bootstrap';
import { FaSearch, FaUser,  FaThumbsUp, FaThumbsDown,FaFire, FaTags, FaFilm, FaSignOutAlt, FaSort, FaSortAmountDown, FaSortAmountUp} from 'react-icons/fa';
import Logo2 from '../Images/Logooo.jpg';
import '../css/HomePageCSS.css';

const mockResults = [
  {
    id: 1,
    title: "Oppenheimer",
    image: "https://www.eyeforfilm.co.uk/images/stills/o/oppenheimer_2023_poster.jpg",
    likes: 95,
    dislikes: 5,
    year: 2023,
    director: "Christopher Nolan",
    rating: 4.8
  },
  {
    id: 2,
    title: "Barbie",
    image: "https://www.themoviedb.org/t/p/original/8uOVNBDjGYitMvE6eJ7EVDH4plG.jpg",
    likes: 85,
    dislikes: 15,
    year: 2023,
    director: "Greta Gerwig",
    rating: 4.2
  },
  {
    id: 3,
    title: "Dune",
    image: "https://www.themoviedb.org/t/p/w1280/szcew6yyjcDvaL0isaPBk2e3nkF.jpg",
    likes: 92,
    dislikes: 8,
    year: 2021,
    director: "Denis Villeneuve",
    rating: 4.5
  },
  {
    id: 4,
    title: "Interstellar",
    image: "https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg",
    likes: 98,
    dislikes: 2,
    year: 2014,
    director: "Christopher Nolan",
    rating: 4.9
  },
  {
    id: 5,
    title: "The Shawshank Redemption",
    image: "https://th.bing.com/th/id/R.6ad8f898b9d05a1c3b732bda17404f7f?rik=V2B%2bCtv3kY5u7A&pid=ImgRaw&r=0",
    likes: 99,
    dislikes: 1,
    year: 1994,
    director: "Frank Darabont",
    rating: 4.9
  },
  {
    id: 6,
    title: "Inception",
    image: "https://flxt.tmsimg.com/assets/p7825626_p_v8_af.jpg",
    likes: 91,
    dislikes: 9,
    year: 2010,
    director: "Christopher Nolan",
    rating: 4.7
  },
  {
    id: 7,
    title: "Pulp Fiction",
    image: "https://m.media-amazon.com/images/I/71c05lTE03L._AC_UF1000,1000_QL80_.jpg",
    likes: 97,
    dislikes: 3,
    year: 1994,
    director: "Quentin Tarantino",
    rating: 4.8
  },
  {
    id: 8,
    title: "The Dark Knight",
    image: "https://th.bing.com/th/id/OIP.t6WXLnWcFMrRLdEW6LxahgHaLH?rs=1&pid=ImgDetMain",
    likes: 94,
    dislikes: 6,
    year: 2008,
    director: "Christopher Nolan",
    rating: 4.8
  }
];

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [sortOption, setSortOption] = useState('relevance');
  const [sortDirection, setSortDirection] = useState('desc');
    const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const params = new URLSearchParams(location.search);
  const query = params.get("query")?.toLowerCase() || "";

  // Filtrar resultados
  let filteredResults = mockResults.filter(movie =>
    movie.title.toLowerCase().includes(query)
  );

  // Ordenar resultados
  filteredResults = filteredResults.sort((a, b) => {
    switch (sortOption) {
      case 'title':
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      case 'year':
        return sortDirection === 'asc' 
          ? a.year - b.year 
          : b.year - a.year;
      case 'rating':
        return sortDirection === 'asc' 
          ? a.rating - b.rating 
          : b.rating - a.rating;
      case 'likes':
        return sortDirection === 'asc' 
          ? a.likes - b.likes 
          : b.likes - a.likes;
      default: // relevance
        return 0;
    }
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.search.value;
    if (searchInput.trim()) {
      navigate('/result')
      setCurrentPage(1); // Resetear a la primera página al realizar nueva búsqueda
    }
  };
  const navigateToReviewForm = (movieId) => {
    //navigate(`/movies/${movieId}/review/new`);
    navigate('/movie');
  };
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/login');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleSort = (option) => {
    if (sortOption === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(option);
      setSortDirection('desc');
    }
  };

  const renderPagination = () => {
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
      <Pagination className="justify-content-center mt-4 ">
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

  return (
    <div className="body-home">
      {/* Navbar */}
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

      {/* Resultados de búsqueda */}
      <Container className="my-5 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">
            Resultados para: <strong>"{query}"</strong>
          </h2>
          
          <Dropdown>
            <Dropdown.Toggle variant="outline-light" id="dropdown-sort">
              <FaSort className="me-2" />
              Ordenar por: {sortOption === 'title' ? 'Título' : 
                           sortOption === 'year' ? 'Año' : 
                           sortOption === 'rating' ? 'Rating' : 
                           sortOption === 'likes' ? 'Likes' : 'Relevancia'}
              {sortDirection === 'asc' ? <FaSortAmountUp className="ms-2" /> : <FaSortAmountDown className="ms-2" />}
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-dark">
              <Dropdown.ItemText className="text-muted">Ordenar por:</Dropdown.ItemText>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => handleSort('relevance')} active={sortOption === 'relevance'}>
                Relevancia
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('title')} active={sortOption === 'title'}>
                Título
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('year')} active={sortOption === 'year'}>
                Año
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('rating')} active={sortOption === 'rating'}>
                Rating
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('likes')} active={sortOption === 'likes'}>
                Likes
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Row className="g-4 mt-3">
          {currentItems.length > 0 ? (
            currentItems.map((movie) => (
              <Col key={movie.id} xl={3} lg={4} md={6} sm={6} xs={12}>
                <Card className="review-card h-100">
                  <div className="movie-poster-container">
                    <Card.Img variant="top" src={movie.image} className="movie-poster" />
                    <div className="movie-overlay">
                      <Button variant="danger" size="sm"  onClick={() => navigateToReviewForm()}>Ver detalles</Button>
                    </div>
                    <Badge bg="danger" className="rating-badge">
                      {movie.rating.toFixed(1)}
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