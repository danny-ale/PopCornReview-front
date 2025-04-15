import React, { useState } from 'react';
import '../css/CrearCategoria.css';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

export default function CrearCategoria() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Estado inicial del formulario
    const initialFormState = {
        nombre: '',
        descripcion: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const validateForm = () => {
        const newErrors = {};
        
        // Validación del nombre
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        } else if (formData.nombre.length > 50) {
            newErrors.nombre = 'El nombre no puede exceder los 50 caracteres';
        }
        
        // Validación de la descripción
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        } else if (formData.descripcion.length < 10) {
            newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
        } else if (formData.descripcion.length > 255) {
            newErrors.descripcion = 'La descripción no puede exceder los 255 caracteres';
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

        // Limpiar error si el usuario está corrigiendo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Función para resetear el formulario
    const resetForm = () => {
        setFormData(initialFormState);
        setErrors({});
        setSubmitError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        
        // Validar el formulario antes de enviar
        if (!validateForm()) {
            toast.warn("Por favor complete correctamente todos los campos", {
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
        
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            const token = localStorage.getItem('token');
            
            if (!userData || !token) {
                throw new Error('No se encontraron datos de autenticación');
            }
            
            const response = await fetch('http://localhost:3001/popCornReview/create/categorie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    Nombre: formData.nombre,
                    Descripcion: formData.descripcion,
                    IdUsuario: userData.userId
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                if (response.status === 400) {
                    toast.warn("La categoría ya existe", {
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
                    toast.error(data.message || "Error al crear la categoría", {
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
            
            // Mostrar mensaje de éxito y limpiar el formulario
            toast.success('Categoría creada exitosamente', {
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
            console.error('Error:', error);
            setSubmitError(error.message || 'Ocurrió un error al crear la categoría');
            toast.error(error.message || "Error al crear la categoría", {
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
        } finally {
            setIsSubmitting(false);
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
                {submitError && (
                    <div className="alert alert-danger" role="alert">
                        {submitError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="form-fields">
                    <label htmlFor="nombre">Nombre*</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        name="nombre" 
                        value={formData.nombre}
                        onChange={handleChange}
                        className={errors.nombre ? 'error' : ''}
                        disabled={isSubmitting}
                        placeholder="Ej: Acción, Comedia, Drama"
                    />
                    {errors.nombre && <p className="error-message">{errors.nombre}</p>}
                    
                    <label htmlFor="descripcion">Descripción*</label>
                    <textarea 
                        id="descripcion" 
                        name="descripcion" 
                        value={formData.descripcion}
                        onChange={handleChange}
                        className={errors.descripcion ? 'error' : ''}
                        disabled={isSubmitting}
                        placeholder="Describe las características de esta categoría"
                        rows="4"
                    />
                    {errors.descripcion && <p className="error-message">{errors.descripcion}</p>}
                    
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creando...' : 'Crear categoría'}
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};