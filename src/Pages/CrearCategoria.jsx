import React, { useState } from 'react';
import '../css/CrearCategoria.css';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function CrearCategoria() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        }
        
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        } else if (formData.descripcion.length < 10) {
            newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Aqui va el envio de datos si todo esta bien
        }
    };

    const handleBack = () => {
        navigate(-1);
    };


return (
    <div className="d-flex flex-row">
        <div className='py-5 px-4'>
            <Button variant="light" onClick={handleBack} className="w-2">
                <FaArrowLeft className="me-2" /> Volver 
            </Button>
        </div>
        <div className="form-container">
            <h1>Crear categoría</h1>
            <form onSubmit={handleSubmit} className="form-fields">
                <label htmlFor="nombre">Nombre</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        name="nombre" 
                        value={formData.nombre}
                        onChange={handleChange}
                        className={errors.nombre ? 'error' : ''}
                    />
                    {errors.nombre && <p className="error-message">{errors.nombre}</p>}
                    
                <label htmlFor="descripcion">Descripción</label>
                    <textarea 
                        id="descripcion" 
                        name="descripcion" 
                        value={formData.descripcion}
                        onChange={handleChange}
                        className={errors.descripcion ? 'error' : ''}
                    />
                    {errors.descripcion && <p className="error-message">{errors.descripcion}</p>}
                    
                <button type="submit" className="submit-button">Crear categoría</button>
            </form>
        </div>
    </div>
    );
};
