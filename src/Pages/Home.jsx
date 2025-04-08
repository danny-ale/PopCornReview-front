import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { FaThumbsUp, FaThumbsDown, FaStar, FaSearch } from 'react-icons/fa';
import '../css/HomePageCSS.css';
import Logo2 from '../Images/Logooo.jpg';

export default function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); 

  const handleSearchChange = (e) => {
    setSearch(e.target.value); 
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Buscando: ${search}`); 
  };

  const LoginClick = () => {
    navigate('/Registro'); 
  };

  return (
    <div className='body-home'>
      <div className="d-flex flex-column min-vh-100">  

        <div className='navbar'>
          <div className='LogoName px-4'>
            <img src={Logo2} alt='Logo' />
            <span>PopCorn Review</span>
          </div>

            <form className="d-flex flex-grow-1 justify-content-center pr-4" onSubmit={handleSearchSubmit}>
                <div className='wsd'>
                    <div className="input-group">
                    <input
                        type="text"
                        className="searchInput"
                        placeholder="Buscar..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <button type="submit" className="btn btn-dark input-group-append">
                        <FaSearch />
                    </button>
                    </div>
                </div>
            </form>

          <div className='ml-auto px-4'>
            <button className='btn btn-dark' onClick={LoginClick}>
            Iniciar Sesión
            </button>
        </div>
        </div>

        <Container fluid className="p-0">
          <Carousel>
            <Carousel.Item>
              <img className="d-block w-100" src="https://static.vecteezy.com/system/resources/previews/002/236/321/non_2x/movie-trendy-banner-vector.jpg" alt="Premios Oscar 2025" />
              <Carousel.Caption>
                <div className='Banner'></div>
                <div className='TextBanner'>
                  <h3>Los Oscar 2025: ¡Los nominados ya están aquí!</h3>
                  <p>Descubre quiénes compiten por la estatuilla dorada este año.</p>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src="https://static.vecteezy.com/system/resources/previews/002/236/321/non_2x/movie-trendy-banner-vector.jpg" alt="Mejor Película 2024" />
              <Carousel.Caption>
                <div className='Banner'></div>
                <div className='TextBanner'>
                  <h3>"Oppenheimer" gana el premio a Mejor Película</h3>
                  <p>La película de Christopher Nolan se lleva el máximo galardón.</p>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src="https://static.vecteezy.com/system/resources/previews/002/236/321/non_2x/movie-trendy-banner-vector.jpg" alt="Mejor Actor" />
              <Carousel.Caption>
                <div className='Banner'></div>
                <div className='TextBanner'>
                  <h3>Cillian Murphy: Mejor Actor en los Oscar 2025</h3>
                  <p>El actor irlandés se consagra con una actuación inolvidable.</p>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Container>

        <Container className="mt-4 d-flex flex-column">
          <h2 className="Titlees">Películas Más Recomendadas</h2>
          <Row>
            {[
              { title: "Oppenheimer", image: "https://www.eyeforfilm.co.uk/images/stills/o/oppenheimer_2023_poster.jpg", likes: 95, dislikes: 5 },
              { title: "Barbie", image: "https://www.themoviedb.org/t/p/original/8uOVNBDjGYitMvE6eJ7EVDH4plG.jpg", likes: 85, dislikes: 15 },
              { title: "John Wick 4", image: "https://th.bing.com/th/id/OIP.T35j1g1cY0Q_qtFhW2Yj5wHaLH?rs=1&pid=ImgDetMain", likes: 90, dislikes: 10 }
            ].map((movie, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className='bg-dark'>
                  <Card.Img variant="top" src={movie.image} />
                  <Card.Body>
                    <Card.Title className='text-white text-center'>{movie.title}</Card.Title>
                    <div className="p-2 d-flex flex-column justify-content-between align-items-center mb-2">
                      <span className='text-white'>
                        <FaThumbsUp className="text-success me-1" />
                        <span className='SubTitles'>{movie.likes}%</span>
                      </span>
                      <span className='text-white'>
                        <FaThumbsDown className="text-danger me-1" />
                        <span className='SubTitles'>{movie.dislikes}%</span>
                      </span>
                    </div>
                    <div className="d-flex justify-content-center p-2">
                      <Button variant="warning" className="w-75 fw-semibold">Ver Reseña</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        <Container className="mt-4 d-flex flex-column">
          <h2 className="Titlees">Películas Mejor Calificadas</h2>
          <Row>
            {[
              { title: "El Padrino", image: "https://diariodeunacinefila.files.wordpress.com/2011/09/poster-de-el-padrino.jpg", percentage: 100 },
              { title: "Cadena Perpetua", image: "https://images-na.ssl-images-amazon.com/images/S/pv-target-images/810745804007581f523d36ba1e88a3a23e82128539002da8975eaf47c82c7027._RI_V_TTW_.jpg", percentage: 99 },
              { title: "El Padrino: Parte II", image: "https://images-na.ssl-images-amazon.com/images/S/pv-target-images/aef2c14fa2092344f51a7ed10a3950963648c9d0e3348c683bc7cd5d7f040c8f._RI_V_TTW_.jpg", percentage: 98 }
            ].map((movie, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className='bg-dark'>
                  <Card.Img variant="top" src={movie.image} />
                  <Card.Body>
                    <Card.Title className='text-white text-center'>{movie.title}</Card.Title>
                    <div className="p-2 d-flex flex-column justify-content-between align-items-center mb-2">
                      <span className='d-flex flex-column text-white'>
                        <div className='p-2'>
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < movie.percentage / 20 ? "text-warning" : "text-secondary"} />
                          ))}
                        </div>
                        <span className='SubTitles'>{movie.percentage}%</span>
                      </span>
                    </div>
                    <div className="d-flex justify-content-center p-2">
                      <Button variant="warning" className="w-75 fw-semibold">Ver Reseña</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        <Container className="mt-4 d-flex flex-column">
          <h2 className="Titlees">Películas Que Te Pueden Gustar</h2>
          <Row>
            <ul className="list-group bg-dark text-white">
              {[
                { title: "Oppenheimer", rating: 4.5 },
                { title: "Barbie", rating: 4.0 },
                { title: "John Wick 4", rating: 4.8 },
                { title: "Avatar: El Camino del Agua", rating: 4.3 },
                { title: "Guardians of the Galaxy Vol. 3", rating: 4.6 },
                { title: "Mission: Impossible – Dead Reckoning", rating: 4.2 },
                { title: "The Flash", rating: 3.9 },
                { title: "Spider-Man: Across the Spider-Verse", rating: 4.7 },
                { title: "Fast X", rating: 3.8 },
                { title: "Scream VI", rating: 3.6 }
              ].map((movie, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center bg-dark border-0">
                  <span className='text-white'>{index + 1}. {movie.title}</span>
                  <div className="d-flex align-items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < movie.rating ? "text-warning" : "text-muted"} />
                    ))}
                    <span className="ms-2 text-white">{movie.rating}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Row>
        </Container>

        <footer className="bg-dark text-white text-center p-3 mt-5">
          <p>&copy; 2025 PopCorn Reviews - Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
