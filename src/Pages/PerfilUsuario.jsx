import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import '../css/PerfilUsuario.css';
import Logo2 from '../Images/Logooo.jpg';
import UserImg from '../Images/usuario.jpg';
import { Container, Row, Col, Card, Button, Form, Badge, Pagination, Dropdown, NavDropdown } from 'react-bootstrap';
import { FaSearch, FaUser,  FaThumbsUp, FaThumbsDown,FaFire, FaTags, FaFilm, FaSignOutAlt, FaSort, FaSortAmountDown, FaSortAmountUp} from 'react-icons/fa';


export default function PerfilUsuario(){
const navigate = useNavigate();
const [search, setSearch] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(true);
    
const handleSearchSubmit = (e) => {
      navigate('/result')
  };
  
  const handleLogin = () => {
        setIsLoggedIn(true);
        navigate('/login');
      };
    
      const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/');
      };

    const handleViewLists = () => {
        console.log('Usuario quiere ver sus listas');
        
    };

    return (
        <div className="user-profile">
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

            <div className="user-container">
                <img 
                    src={UserImg} 
                    alt="Usuario" 
                    className="user-photo"
                />
                <div className="user-info">
                    <p><span className="label"><strong>Nombre:</strong></span> EjemploUsuario</p>
                    <p><span className="label"><strong>Correo:</strong></span> ejemplo@correo.com</p>
                    <p><span className="label"><strong>Fecha de Nacimiento:</strong></span> 01/01/2000</p>
                    <p><span className="label"><strong>Estatus:</strong></span> Activo</p>
                    <button 
                        className="view-lists-button" 
                        onClick={() => navigate('/ListaReview')}
                    >
                        Ver listas
                    </button>
                </div>
            </div>
        </div>
    );
};
