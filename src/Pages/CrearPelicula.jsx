import React, { useState } from 'react';
import '../css/CrearPelicula.css';
import MovieImg from '../Images/pelicula.jpg';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function CrearPelicula() {
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState('pelicula.jpg');

    const [formData, setFormData] = useState({
        titulo: '',
        anio: '',
        clasificacion: 'G',
        director: '',
        sinopsis: '',
        cartel: null,
        reparto: '', 
        trailerUrl: '' 
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
                cartel: file
            }));
            
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const peliculaData = {
            ...formData,
            reparto: formData.reparto.split(',').map(actor => actor.trim())
        };
        
        console.log('Datos del formulario:', peliculaData);
        // Aquí van los datos que se van a enviar al servidor
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
                                id="cartel" 
                                name="cartel" 
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-fields">
                            <label htmlFor="titulo">Título de la película</label>
                            <input 
                                type="text" 
                                id="titulo" 
                                name="titulo" 
                                value={formData.titulo}
                                onChange={handleChange}
                                required 
                            />
                            
                            <label htmlFor="anio">Año de lanzamiento</label>
                            <input 
                                type="number" 
                                id="anio" 
                                name="anio" 
                                value={formData.anio}
                                onChange={handleChange}
                                required 
                            />

                            <label htmlFor="clasificacion">Clasificación</label>
                            <select 
                                id="clasificacion" 
                                name="clasificacion" 
                                value={formData.clasificacion}
                                onChange={handleChange}
                                required
                            >
                                <option value="G">G</option>
                                <option value="PG">PG</option>
                                <option value="PG-13">PG-13</option>
                                <option value="R">R</option>
                            </select>

                            <label htmlFor="director">Director</label>
                            <input 
                                type="text" 
                                id="director" 
                                name="director" 
                                value={formData.director}
                                onChange={handleChange}
                                required 
                            />

                            <label htmlFor="reparto">Reparto (separado por comas)</label>
                            <input 
                                type="text" 
                                id="reparto" 
                                name="reparto" 
                                value={formData.reparto}
                                onChange={handleChange}
                                placeholder="Ej: Actor 1, Actor 2, Actor 3"
                            />

                            <label htmlFor="trailerUrl">URL del Trailer</label>
                            <input 
                                type="url" 
                                id="trailerUrl" 
                                name="trailerUrl" 
                                value={formData.trailerUrl}
                                onChange={handleChange}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />

                            <label htmlFor="sinopsis">Sinopsis</label>
                            <textarea 
                                id="sinopsis" 
                                name="sinopsis" 
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
