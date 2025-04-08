import React from 'react';
import '../css/ListaReview.css';
import MovieImg from '../Images/pelicula.jpg';

export default function ListaReview() {
    return (
        <div className="user-lists">
            <h1>Listas de Usuario1</h1>
            <div className="container">
                <div className="list-section">
                    <h2>Favoritos</h2>
                    <div className="movie-container">
                        <img src={MovieImg} alt="Película" className="movie-image" />
                        <div className="movie-info">
                            <p><strong>Título:</strong> Ejemplo de Película</p>
                            <p><strong>Año:</strong> 2025</p>
                            <p><strong>Clasificación:</strong> PG-13</p>
                            <p><strong>Director:</strong> Ejemplo Director</p>
                        </div>
                    </div>
                </div>
                <div className="list-section">
                    <h2>Reseñas</h2>
                    <div className="movie-container">
                        <img src={MovieImg} alt="Película" className="movie-image" />
                        <div className="movie-info">
                            <p><strong>Título:</strong> Ejemplo de Película</p>
                            <p><strong>Año:</strong> 2025</p>
                            <p><strong>Clasificación:</strong> PG-13</p>
                            <p><strong>Director:</strong> Ejemplo Director</p>
                            <p><strong>Reseña:</strong> Ejemplo Reseña.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
