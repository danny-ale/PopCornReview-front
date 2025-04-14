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


    const [formData, setFormData] = useState({
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
    });

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
            setFormData(prev => ({
                ...prev,
                Portada: file
            }));
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            });
            
        } catch (error) {
            console.error('Error al crear película:', error);
            setError(error.message || 'Ocurrió un error al crear la película');
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
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-fields">
                            <label htmlFor="Titulo">Título de la película</label>
                            <input 
                                type="text" 
                                id="Titulo" 
                                name="Titulo" 
                                value={formData.titulo}
                                onChange={handleChange}
                                required 
                            />
                            
                            <label htmlFor="AnioLanzamiento">Año de lanzamiento</label>
                            <input 
                                type="number" 
                                id="AnioLanzamiento" 
                                name="AnioLanzamiento" 
                                value={formData.anio}
                                onChange={handleChange}
                                required 
                            />

                            <label htmlFor="DuracionMin">Duración en Minutos</label>
                            <input 
                                type="number" 
                                id="DuracionMin" 
                                name="DuracionMin" 
                                value={formData.DuracionMin}
                                onChange={handleChange}
                                required 
                            />

                            <label htmlFor="IdCategoria">Categoría</label>
                            <select
                                    id="IdCategoria"
                                    name="IdCategoria"
                                    value={formData.IdCategoria}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categories.map(category => (
                                        <option key={category.Id} value={category.Id}>
                                            {category.Nombre}
                                        </option>
                                    ))}
                            </select>
                            

                            <label htmlFor="Clasificacion">Clasificación</label>
                            <select 
                                id="Clasificacion" 
                                name="Clasificacion" 
                                value={formData.clasificacion}
                                onChange={handleChange}
                                required
                            >
                                <option value="G">G</option>
                                <option value="PG">PG</option>
                                <option value="PG-13">PG-13</option>
                                <option value="R">R</option>
                            </select>

                            <label htmlFor="Director">Director</label>
                            <input 
                                type="text" 
                                id="Director" 
                                name="Director" 
                                value={formData.director}
                                onChange={handleChange}
                                required 
                            />

                            <label htmlFor="Reparto">Reparto (separado por comas)</label>
                            <input 
                                type="text" 
                                id="Reparto" 
                                name="Reparto" 
                                value={formData.reparto}
                                onChange={handleChange}
                                placeholder="Ej: Actor 1, Actor 2, Actor 3"
                            />

                            <label htmlFor="Trailer">URL del Trailer</label>
                            <input 
                                type="url" 
                                id="Trailer" 
                                name="Trailer" 
                                value={formData.trailerUrl}
                                onChange={handleChange}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />

                            <label htmlFor="sinopsis">Sinopsis</label>
                            <textarea 
                                id="Sinopsis" 
                                name="Sinopsis" 
                                value={formData.sinopsis}
                                onChange={handleChange}
                                required
                            ></textarea>

                            <button type="submit" className="submit-button">Confirmar película</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
