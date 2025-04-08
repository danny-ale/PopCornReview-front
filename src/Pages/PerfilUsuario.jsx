import React from 'react';
import '../css/PerfilUsuario.css';
import Logo2 from '../Images/Logooo.jpg';
import UserImg from '../Images/usuario.jpg';

export default function PerfilUsuario(){
    const handleLogout = () => {
        console.log('Usuario cerró sesión');
        // Aquí iría la lógica para cerrar sesión
    };

    const handleViewLists = () => {
        console.log('Usuario quiere ver sus listas');
        // Aquí iría la navegación a la página de listas
    };

    return (
        <div className="user-profile">
            <header>
                <img src={Logo2} alt="Logo" className="logo" />
                <button className="logout-button" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </header>

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
                        onClick={handleViewLists}
                    >
                        Ver listas
                    </button>
                </div>
            </div>
        </div>
    );
};
