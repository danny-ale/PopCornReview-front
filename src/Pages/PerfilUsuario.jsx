import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form, Dropdown, NavDropdown, Image, Modal, Spinner } from 'react-bootstrap';
import { FaSearch, FaUser, FaTags, FaFilm, FaSignOutAlt, FaEdit, FaCalendarAlt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Logo2 from '../Images/Logooo.jpg';
import UserImg from '../Images/usuario.jpg';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";
import '../css/PerfilUsuario.css';

export default function PerfilUsuario() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [userData, setUserData] = useState({
    Id: null,
    Nombre: "",
    Correo: "",
    Fecha_Nac: "",
    Descripción: "",
    Contraseña: "",
    Imagen: "" 
  });
  const [editData, setEditData] = useState({...userData});

  const fetchUserData = async () => {
    try {
  
      const userDataLS = JSON.parse(localStorage.getItem('userData'));
      const userId = userDataLS?.userId;
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(
        `http://localhost:3001/popCornReview/getInfo/${userId}`,
        { headers }
      );
      if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario');
      }
      
      const result = await response.json();
      
      const getImageUrl = (imageData) => {
        if (!imageData) return UserImg;
        
        if (imageData.type === "Buffer" && Array.isArray(imageData.data)) {  
          const chunkSize = 65536; 
          const chunks = [];
          
          for (let i = 0; i < imageData.data.length; i += chunkSize) {
            const chunk = imageData.data.slice(i, i + chunkSize);
            chunks.push(String.fromCharCode.apply(null, chunk));
          }
          
          const base64String = chunks.join('');
          return `data:image/jpeg;base64,${base64String}`;
        }
        
        if (typeof imageData === 'string') {
          if (imageData.startsWith('data:image')) {
            return imageData;
          }
          return `data:image/jpeg;base64,${imageData}`;
        }
        
        return UserImg;
      };
      
      setUserData({
        Id: result.data.Id,
        Nombre: result.data.Nombre,
        Correo: result.data.Correo,
        Fecha_Nac: result.data.Fecha_Nac.split('T')[0], 
        Descripción: result.data.Descripción || "No hay descripción",
        Contraseña: result.data.Contraseña,
        Imagen: getImageUrl(result.data.Imagen)
      });
      
      setEditData({
        Id: result.data.Id,
        Nombre: result.data.Nombre,
        Correo: result.data.Correo,
        Fecha_Nac: result.data.Fecha_Nac.split('T')[0],
        Descripción: result.data.Descripción || "",
        Contraseña: result.data.Contraseña,
        Imagen: getImageUrl(result.data.Imagen)
      });
      
      setLoading(false);
      console.log(result.data.Imagen);
      console.log("Imagen Array:", getImageUrl(result.data.Imagen));

    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.search?.value || search; 
    if(searchInput.trim()) {
      navigate(`/result?query=${encodeURIComponent(searchInput.trim())}`);
    }
};


  const handleEditProfile = () => {
    setEditData({
      Nombre: userData.Nombre,
      Correo: userData.Correo,
      Fecha_Nac: userData.Fecha_Nac, 
      Descripción: userData.Descripción,
      imagenOriginal: userData.Imagen 
    });
    setOriginalData({
      Nombre: userData.Nombre,
      Correo: userData.Correo,
      Fecha_Nac: userData.Fecha_Nac,
      Descripción: userData.Descripción
    });
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    if (!validateEditForm()) return;
  
    try {

      const dataToSend = {
        userId: userData.Id, 
        nombre: editData.Nombre || originalData.Nombre,
        correo: editData.Correo || originalData.Correo,
        fecha_nac: editData.Fecha_Nac || originalData.Fecha_Nac,
        contrasena: editData.Contraseña || undefined, 
        descripcion: editData.Descripción || originalData.Descripción,
        imagen: editData.newImage || undefined 
      };
  
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === undefined) {
          delete dataToSend[key];
        }
      });
  
      const response = await fetch('http://localhost:3001/popCornReview/updateUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dataToSend)
      });
  
      const result = await response.json();
  
      if (result.success) {
        toast.success('Perfil actualizado correctamente', {
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
        
        const updatedUserData = {
          email: dataToSend.correo || userData.email,
          name: dataToSend.nombre || userData.name,
          userId:  dataToSend.userId 
        };
        
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        await fetchUserData();
        setShowEditModal(false);
        
      } else {
        throw new Error(result.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al actualizar el perfil', {
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
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({
          ...editData,
          newImage: reader.result.split(',')[1] 
        });
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


  const validateEditForm = () => {
    let valid = true;
    const newErrors = {};
  
    // Validación del nombre
    if (editData.Nombre && !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(editData.Nombre.trim())) {
      newErrors.Nombre = "El nombre solo debe contener letras y espacios.";
      valid = false;
    }
  
    // Validación del correo
    if (editData.Correo && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(editData.Correo.trim())) {
      newErrors.Correo = "El correo electrónico no es válido.";
      valid = false;
    }
  
    // Validación de la contraseña (solo si se proporciona una nueva)
    if (editData.Contraseña && !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(editData.Contraseña)) {
      newErrors.Contraseña = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.";
      valid = false;
    }
  
    // Validación de fecha de nacimiento
    if (editData.Fecha_Nac) {
      const currentDate = new Date();
      const birthDate = new Date(editData.Fecha_Nac);
      if (birthDate > currentDate) {
        newErrors.Fecha_Nac = "La fecha de nacimiento no puede ser futura.";
        valid = false;
      }
    }
  
    setErrors(newErrors);
    return valid;
  };
  
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  
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

      <Container className="profile-container">
        <div className="user-profile-card">
          <div className="profile-header">
            <div className="avatar-container">
            <Image 
              src={userData.Imagen} 
              roundedCircle 
              className="profile-avatar"
              onError={(e) => {
                console.error('Error cargando imagen:', e);
                e.target.src = UserImg;
              }}
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
              <p className="detail-value bio-text">{userData.Descripción}</p>
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
                value={editData.Nombre || ''}
                onChange={(e) => setEditData({...editData, Nombre: e.target.value})}
                isInvalid={!!errors.Nombre}
              />
              <Form.Control.Feedback type="invalid">
                {errors.Nombre}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control 
                type="email" 
                value={editData.Correo || ''}
                onChange={(e) => setEditData({...editData, Correo: e.target.value})}
                isInvalid={!!errors.Correo}
              />
              <Form.Control.Feedback type="invalid">
                {errors.Correo}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control 
                type="date" 
                value={editData.Fecha_Nac || ''}
                onChange={(e) => setEditData({...editData, Fecha_Nac: e.target.value})}
                isInvalid={!!errors.Fecha_Nac}
              />
              <Form.Control.Feedback type="invalid">
                {errors.Fecha_Nac}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Contraseña (dejar vacío para no cambiar)</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Nueva contraseña"
                value={editData.Contraseña || ''}
                onChange={(e) => setEditData({...editData, Contraseña: e.target.value})}
                isInvalid={!!errors.Contraseña}
              />
              <Form.Control.Feedback type="invalid">
                {errors.Contraseña}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={editData.Descripción || ''}
                onChange={(e) => setEditData({...editData, Descripción: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Cambiar Imagen (opcional)</Form.Label>
              <Form.Control 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {editData.imagenOriginal && !editData.newImage && (
                <div className="mt-2">
                  <p className="small text-muted">Imagen actual:</p>
                  <img 
                    src={editData.imagenOriginal} 
                    alt="Perfil actual" 
                    style={{maxWidth: '100px', maxHeight: '100px'}}
                  />
                </div>
              )}
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