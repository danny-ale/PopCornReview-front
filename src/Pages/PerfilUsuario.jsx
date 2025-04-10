import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form, Dropdown, NavDropdown, Image, Modal, Badge } from 'react-bootstrap';
import { FaSearch, FaUser, FaTags, FaFilm, FaSignOutAlt, FaEdit, FaCalendarAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Logo2 from '../Images/Logooo.jpg';
import UserImg from '../Images/usuario.jpg';
import '../css/PerfilUsuario.css';

export default function PerfilUsuario() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState({
    Nombre: "EjemploUsuario",
    Correo: "ejemplo@correo.com",
    Fecha_Nac: "2000-01-01",
    Descripción: "Amante del cine clásico y las películas de ciencia ficción",
    Contraseña: "passwordEjemplo",
    Imagen: UserImg
  });
  const [editData, setEditData] = useState({...userData});

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/result');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleEditProfile = () => {
    setEditData({...userData});
    setShowEditModal(true);
  };

  const handleSaveChanges = () => {
    setUserData({...editData});
    setShowEditModal(false);
    // Aquí iría la lógica para actualizar en la base de datos
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({...editData, Imagen: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };


const handleLogin = () => {
      setIsLoggedIn(true);
      navigate('/login');
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

      <Container className="profile-container">
        <div className="user-profile-card">
          <div className="profile-header">
            <div className="avatar-container">
              <Image 
                src={userData.Imagen} 
                roundedCircle 
                className="profile-avatar"
              />
              <Button 
                variant="outline-light" 
                size="sm" 
                className="edit-avatar-btn"
                onClick={() => document.getElementById('imageUpload').click()}
              >
                <FaEdit />
              </Button>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                style={{display: 'none'}}
                onChange={handleImageChange}
              />
            </div>
            <h2 className="profile-username">{userData.Nombre}</h2>
            <Button 
              variant="outline-warning" 
              onClick={handleEditProfile}
              className="edit-profile-btn"
            >
              <FaEdit className="me-2" /> Editar Perfil
            </Button>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label"><FaUser /> Nombre:</span>
              <span className="detail-value">{userData.Nombre}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">✉️ Correo:</span>
              <span className="detail-value">{userData.Correo}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label"><FaCalendarAlt /> Fecha Nacimiento:</span>
              <span className="detail-value">{formatDate(userData.Fecha_Nac)}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label"><FaLock /> Contraseña:</span>
              <div className="password-field">
                {showPassword ? userData.Contraseña : '••••••••'}
                <Button 
                  variant="link" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </div>
            
            <div className="detail-item bio-item">
              <span className="detail-label">📝 Descripción:</span>
              <p className="detail-value bio-text">{userData.Descripción || "No hay descripción"}</p>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">🔘 Estatus:</span>
              <Badge bg={userData.Estatus ? "success" : "secondary"}>
                {userData.Estatus ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>

          <div className="profile-actions">
            <Button 
              variant="danger" 
              className="action-btn"
              onClick={() => navigate('/ListaReview')}
            >
              Ver Mis Listas
            </Button>
            <Button 
              variant="outline-danger" 
              className="action-btn"
              onClick={() => navigate('/favoritos')}
            >
              Mis Favoritos
            </Button>
          </div>
        </div>
      </Container>

      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered className="dark-modal">
        <Modal.Header closeButton>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                value={editData.Nombre}
                onChange={(e) => setEditData({...editData, Nombre: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control 
                type="email" 
                value={editData.Correo}
                onChange={(e) => setEditData({...editData, Correo: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control 
                type="date" 
                value={editData.Fecha_Nac}
                onChange={(e) => setEditData({...editData, Fecha_Nac: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={editData.Descripción}
                onChange={(e) => setEditData({...editData, Descripción: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Cambiar Imagen</Form.Label>
              <Form.Control 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}