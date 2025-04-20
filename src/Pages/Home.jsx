import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Carousel,Spinner, Form, ListGroup, Dropdown, NavDropdown } from 'react-bootstrap';
import { FaSearch, FaUser, FaSignOutAlt, FaFilm, FaTags, FaStar } from 'react-icons/fa';
import '../css/HomePageCSS.css';
import Logo2 from '../Images/Logooo.jpg';
import FeaturedMovies from '../Components/Card_FeaturedMovies';
import TopRatedMovies from '../Components/Card_TopRatedMovies';
import MostReviewedMovies from '../Components/Card_MostReviewMovie';
import NewlyAddedMovies from '../Components/Card_NewlyMovies';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

export default function Home() {
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [mostReviewedMovies, setMostReviewedMovies] = useState([]);
  const [newlyAddedMovies, setNewlyAddedMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
  

        const [featuredResponse, topRatedResponse, mostReviewedResponse,newAddResponse] = await Promise.all([
          fetch('http://localhost:3001/popCornReview/getMostFeatured/movie', { headers }),
          fetch('http://localhost:3001/popCornReview/getMostStarts/movie', { headers }),
          fetch('http://localhost:3001/popCornReview/getMostReviewed/movie', { headers }),
          fetch('http://localhost:3001/popCornReview/getRecent/movie', { headers })
        ]);
  

        if (!featuredResponse.ok || !topRatedResponse.ok || !mostReviewedResponse.ok || !newAddResponse.ok) {
          throw new Error('Error al obtener datos de películas');
        }
  

        const featuredData = await featuredResponse.json();
        const topRatedData = await topRatedResponse.json();
        const mostReviewedData = await mostReviewedResponse.json();
        const newAddData = await newAddResponse.json();
  

        setFeaturedMovies(featuredData.data.map(movie => ({
          id: movie.Id,
          title: movie.Titulo,
          year: movie.Año_Lanzamiento,
          director: movie.Director,
          image: movie.Portada ? `data:image/jpeg;base64,${arrayBufferToBase64(movie.Portada.data)}` : placeholderImage,
          likes: movie.Recomendaciones_Positivas,
          dislikes: movie.Recomendaciones_Negativas,
          badgeText: `${movie.Porcentaje_Pos}% positivas`
        })));
  
        setTopRatedMovies(topRatedData.data.map(movie => ({
          id: movie.Id,
          title: movie.Titulo,
          year: movie.Año_Lanzamiento,
          director: movie.Director,
          image: movie.Portada ? `data:image/jpeg;base64,${arrayBufferToBase64(movie.Portada.data)}` : placeholderImage,
          rating: parseFloat(movie.Promedio_Estrellas),
          badgeText: `${parseFloat(movie.Promedio_Estrellas).toFixed(1)} ★`
        })));
  
        setMostReviewedMovies(mostReviewedData.data.map(movie => ({
          id: movie.Id,
          title: movie.Titulo,
          year: movie.Año_Lanzamiento,
          director: movie.Director,
          image: movie.Portada ? `data:image/jpeg;base64,${arrayBufferToBase64(movie.Portada.data)}` : placeholderImage,
          reviews: movie.Total_Reseñas,
          rating:movie.Promedio_Estrellas
        })));

        setNewlyAddedMovies(newAddData.data.map(movie => ({
          id: movie.Id,
          title: movie.Titulo,
          year: movie.Año_Lanzamiento,
          director: movie.Director
        })));

        setRecommendedMovies(
          topRatedData.data.slice(0, 5).map((movie, index) => ({
            title: movie.Titulo,
            rating: parseFloat(movie.Promedio_Estrellas),
            id: movie.Id
        })));
 
  
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMovies();
  }, []);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };


  const formatAddedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
  };


  const placeholderImage = 'https://via.placeholder.com/300x450?text=No+Image';

  const handleSearchChange = (e) => {
    setSearch(e.target.value); 
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.search?.value || search; 
    if(searchInput.trim()) {
      navigate(`/result?query=${encodeURIComponent(searchInput.trim())}`);
    }
};

  const navigateToMovie = (movieId) => {
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

const carouselItems = [
  {
    title: "Los Oscar 2025: ¡Los nominados ya están aquí!",
    description: "Descubre quiénes compiten por la estatuilla dorada este año.",
    image: "https://i.pinimg.com/736x/b2/7a/6a/b27a6a991d882c0c5b9a249d02cb6382.jpg"
  },
  {
    title: "Oppenheimer gana el premio a Mejor Película",
    description: "La película de Christopher Nolan se lleva el máximo galardón.",
    image: "https://i.pinimg.com/736x/b2/7a/6a/b27a6a991d882c0c5b9a249d02cb6382.jpg"
  },
  {
    title: "Cillian Murphy: Mejor Actor en los Oscar 2025",
    description: "El actor irlandés se consagra con una actuación inolvidable.",
    image: "https://i.pinimg.com/736x/b2/7a/6a/b27a6a991d882c0c5b9a249d02cb6382.jpg"
  }
];


  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="danger" size="lg" />
        <p className="mt-3">Cargando películas...</p>
      </div>
    );
  }

  return (
    <div className='body-home'>
      <div className="d-flex flex-column min-vh-100">  
       
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

        <Carousel fade className="hero-carousel">
          {carouselItems.map((item, index) => (
            <Carousel.Item key={index}>
              <div 
                className="carousel-image"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <Carousel.Caption className="carousel-caption">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>

        
        {featuredMovies.length > 0 && (
          <FeaturedMovies 
            movies={featuredMovies} 
            navigateToMovie={navigateToMovie}
          />
        )}

        {topRatedMovies.length > 0 && (
          <TopRatedMovies 
            movies={topRatedMovies} 
            navigateToMovie={navigateToMovie}
          />
        )}

        {mostReviewedMovies.length > 0 && (
          <MostReviewedMovies 
            movies={mostReviewedMovies} 
            navigateToMovie={navigateToMovie}
          />
        )}

        {newlyAddedMovies.length > 0 && (
          <NewlyAddedMovies 
            movies={newlyAddedMovies} 
            navigateToMovie={navigateToMovie}
          />
        )}

        <Container className="my-5 d-flex flex-column">
          <h2 className="section-title">
            <span>Películas Que Te Pueden Gustar</span>
          </h2>
          <ListGroup className="recommendations-list">
            {recommendedMovies.map((movie, index) => (
              <ListGroup.Item 
                key={index} 
                className="recommendation-item"
                action
                onClick={() => navigateToMovie(movie.id || index + 7)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span className="recommendation-title">
                    {index + 1}. {movie.title}
                  </span>
                  <div className="d-flex align-items-center">
                    <div className="star-rating small">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(movie.rating) ? "filled" : "empty"} 
                        />
                      ))}
                    </div>
                    <span className="rating-value ms-2">{movie.rating.toFixed(1)}</span>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>

        <footer className="footer mt-auto py-4 bg-dark text-center">
          <Container>
            <p className="mb-0">&copy; 2025 PopCorn Reviews - Todos los derechos reservados.</p>
            <div className="footer-links mt-2">
              <a href="/about">Acerca de</a>
              <a href="/contact">Contacto</a>
              <a href="/privacy">Privacidad</a>
              <a href="/terms">Términos</a>
            </div>
          </Container>
        </footer>


      </div>
    </div>
  );
}