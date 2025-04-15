import React, { useState, useEffect } from 'react';
import '../css/CrearPelicula.css';
import MovieImg from '../Images/pelicula.jpg';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

export default function CrearPelicula() {
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState('pelicula.jpg');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState([]); 
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [formErrors, setFormErrors] = useState({});

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró token de autenticación');
            }

            const response = await fetch('http://localhost:3001/popCornReview/getAll/categories', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener categorías');
            }

            setCategories(data.data); 
            setLoadingCategories(false);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            setError(error.message);
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const initialFormState = {
        IdCategoria: '', 
        Titulo: '',
        AnioLanzamiento: '',
        DuracionMin: '',
        Clasificacion: 'G',
        Director: '',
        Sinopsis: '',
        Portada: null,
        Reparto: '', 
        Trailer: '',
        IdUsuario: JSON.parse(localStorage.getItem('userData'))?.userId || ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const validateForm = () => {
        const errors = {};
        const currentYear = new Date().getFullYear();

        // Validación de título
        if (!formData.Titulo.trim()) {
            errors.Titulo = 'El título es requerido';
        } else if (formData.Titulo.length > 100) {
            errors.Titulo = 'El título no puede exceder los 100 caracteres';
        }

        // Validación de año de lanzamiento
        if (!formData.AnioLanzamiento) {
            errors.AnioLanzamiento = 'El año de lanzamiento es requerido';
        } else if (formData.AnioLanzamiento < 1888) { // Primer año de cine
            errors.AnioLanzamiento = 'El año debe ser mayor a 1888';
        } else if (formData.AnioLanzamiento > currentYear + 2) {
            errors.AnioLanzamiento = `El año no puede ser mayor a ${currentYear + 2}`;
        }

        // Validación de duración
        if (!formData.DuracionMin) {
            errors.DuracionMin = 'La duración es requerida';
        } else if (formData.DuracionMin < 1) {
            errors.DuracionMin = 'La duración debe ser al menos 1 minuto';
        } else if (formData.DuracionMin > 600) { // 10 horas
            errors.DuracionMin = 'La duración no puede exceder 600 minutos';
        }

        // Validación de categoría
        if (!formData.IdCategoria) {
            errors.IdCategoria = 'Debe seleccionar una categoría';
        }

        // Validación de director
        if (!formData.Director.trim()) {
            errors.Director = 'El director es requerido';
        } else if (formData.Director.length > 100) {
            errors.Director = 'El nombre del director no puede exceder los 100 caracteres';
        }

        // Validación de sinopsis
        if (!formData.Sinopsis.trim()) {
            errors.Sinopsis = 'La sinopsis es requerida';
        } else if (formData.Sinopsis.length > 1000) {
            errors.Sinopsis = 'La sinopsis no puede exceder los 1000 caracteres';
        }

        // Validación de URL del trailer (opcional pero debe ser válida si existe)
        if (formData.Trailer && !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(formData.Trailer)) {
            errors.Trailer = 'Ingrese una URL válida de YouTube';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.match('image.*')) {
                setFormErrors(prev => ({
                    ...prev,
                    Portada: 'Solo se permiten archivos de imagen'
                }));
                return;
            }

            // Validar tamaño de archivo (ej. 5MB máximo)
            if (file.size > 5 * 1024 * 1024) {
                setFormErrors(prev => ({
                    ...prev,
                    Portada: 'La imagen no puede exceder los 5MB'
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                Portada: file
            }));
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            // Limpiar error si la validación pasa
            setFormErrors(prev => {
                const newErrors = {...prev};
                delete newErrors.Portada;
                return newErrors;
            });
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setPreviewImage('pelicula.jpg');
        setFormErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar antes de enviar
        if (!validateForm()) {
            toast.warn("Por favor complete correctamente todos los campos requeridos", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }

        setIsSubmitting(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró token de autenticación');
            }

            const formDataToSend = new FormData();
            
            Object.keys(formData).forEach(key => {
                if (key === 'Portada' && formData[key]) {
                    formDataToSend.append(key, formData[key]);
                } else if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await fetch('http://localhost:3001/popCornReview/create/movie', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    toast.warn("La película ya existe", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    newestOnTop: false,
                    closeOnClick: false,
                    rtl: false,
                    pauseOnFocusLoss: true,
                    draggable: true,
                    pauseOnHover: true,
                    theme: "dark",
                    transition: Bounce
                    });
                } else {
                    toast.error("Error al crear la película", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    newestOnTop: false,
                    closeOnClick: false,
                    rtl: false,
                    pauseOnFocusLoss: true,
                    draggable: true,
                    pauseOnHover: true,
                    theme: "dark",
                    transition: Bounce
                    });
                 }
                return;
            }

            setSuccess(true);
            toast.success('Película creada exitosamente', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
                onClose: resetForm // Limpiar el formulario cuando el toast se cierre
            });
            
        } catch (error) {
            console.error('Error al crear película:', error);
            setError(error.message || 'Ocurrió un error al crear la película');
            toast.error(error.message || 'Ocurrió un error al crear la película', {
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
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="movie-form">
            <h1>Registrar Película</h1>
            <div className="d-flex flex-row">
                <div className='py-5 px-4'>
                    <Button variant="light" onClick={handleBack} className="w-2">
                    <FaArrowLeft className="me-2" /> Volver 
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="image-section">
                        <div className="image-container">
                            <p>Cartel</p>
                            <img 
                                src={previewImage || MovieImg} 
                                alt="Imagen de la película" 
                                style={{ width: '200px', height: '300px', borderRadius: '10px' }} 
                            />
                            <input 
                                type="file" 
                                id="Portada" 
                                name="Portada" 
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            {formErrors.Portada && (
                                <div className="error-message">{formErrors.Portada}</div>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-fields">
                            <label htmlFor="Titulo">Título de la película*</label>
                            <input 
                                type="text" 
                                id="Titulo" 
                                name="Titulo" 
                                value={formData.Titulo}
                                onChange={handleChange}
                                className={formErrors.Titulo ? 'error' : ''}
                            />
                            {formErrors.Titulo && (
                                <div className="error-message">{formErrors.Titulo}</div>
                            )}
                            
                            <label htmlFor="AnioLanzamiento">Año de lanzamiento*</label>
                            <input 
                                type="number" 
                                id="AnioLanzamiento" 
                                name="AnioLanzamiento" 
                                value={formData.AnioLanzamiento}
                                onChange={handleChange}
                                min="1888"
                                max={new Date().getFullYear() + 2}
                                className={formErrors.AnioLanzamiento ? 'error' : ''}
                            />
                            {formErrors.AnioLanzamiento && (
                                <div className="error-message">{formErrors.AnioLanzamiento}</div>
                            )}

                            <label htmlFor="DuracionMin">Duración en Minutos*</label>
                            <input 
                                type="number" 
                                id="DuracionMin" 
                                name="DuracionMin" 
                                value={formData.DuracionMin}
                                onChange={handleChange}
                                min="1"
                                max="600"
                                className={formErrors.DuracionMin ? 'error' : ''}
                            />
                            {formErrors.DuracionMin && (
                                <div className="error-message">{formErrors.DuracionMin}</div>
                            )}

                            <label htmlFor="IdCategoria">Categoría*</label>
                            <select
                                id="IdCategoria"
                                name="IdCategoria"
                                value={formData.IdCategoria}
                                onChange={handleChange}
                                className={formErrors.IdCategoria ? 'error' : ''}
                            >
                                <option value="">Seleccione una categoría</option>
                                {categories.map(category => (
                                    <option key={category.Id} value={category.Id}>
                                        {category.Nombre}
                                    </option>
                                ))}
                            </select>
                            {formErrors.IdCategoria && (
                                <div className="error-message">{formErrors.IdCategoria}</div>
                            )}
                            
                            <label htmlFor="Clasificacion">Clasificación*</label>
                            <select 
                                id="Clasificacion" 
                                name="Clasificacion" 
                                value={formData.Clasificacion}
                                onChange={handleChange}
                            >
                                <option value="G">G</option>
                                <option value="PG">PG</option>
                                <option value="PG-13">PG-13</option>
                                <option value="R">R</option>
                            </select>

                            <label htmlFor="Director">Director*</label>
                            <input 
                                type="text" 
                                id="Director" 
                                name="Director" 
                                value={formData.Director}
                                onChange={handleChange}
                                className={formErrors.Director ? 'error' : ''}
                            />
                            {formErrors.Director && (
                                <div className="error-message">{formErrors.Director}</div>
                            )}

                            <label htmlFor="Reparto">Reparto (separado por comas)</label>
                            <input 
                                type="text" 
                                id="Reparto" 
                                name="Reparto" 
                                value={formData.Reparto}
                                onChange={handleChange}
                                placeholder="Ej: Actor 1, Actor 2, Actor 3"
                            />

                            <label htmlFor="Trailer">URL del Trailer</label>
                            <input 
                                type="url" 
                                id="Trailer" 
                                name="Trailer" 
                                value={formData.Trailer}
                                onChange={handleChange}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className={formErrors.Trailer ? 'error' : ''}
                            />
                            {formErrors.Trailer && (
                                <div className="error-message">{formErrors.Trailer}</div>
                            )}

                            <label htmlFor="Sinopsis">Sinopsis*</label>
                            <textarea 
                                id="Sinopsis" 
                                name="Sinopsis" 
                                value={formData.Sinopsis}
                                onChange={handleChange}
                                className={formErrors.Sinopsis ? 'error' : ''}
                            ></textarea>
                            {formErrors.Sinopsis && (
                                <div className="error-message">{formErrors.Sinopsis}</div>
                            )}

                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Enviando...' : 'Confirmar película'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};