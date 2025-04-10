import React, { useState } from 'react';
import '../css/ListaReview.css';
import MovieImg from '../Images/pelicula.jpg';

export default function ListaReview() {
    const [approved, setApproved] = useState(false);
    const [rating, setRating] = useState(3);  // Calificación predeterminada 3

    const toggleApproval = () => {
        setApproved(!approved);
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    return (
        <div className="user-lists">
            <h1>Listas de Usuario1</h1>
            <div className="container">
                {/* Favoritos */}
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

                {/* Reseñas */}
                <div className="list-section">
                    <h2>Reseñas</h2>
                    <div className="movie-container">
                        <img src={MovieImg} alt="Película" className="movie-image" />
                        <div className="movie-info">
                            <p><strong>Título:</strong> Ejemplo de Película</p>
                            <p><strong>Año:</strong> 2025</p>
                            <p><strong>Clasificación:</strong> PG-13</p>
                            <p><strong>Director:</strong> Ejemplo Director</p>
                            <p><strong>Reseña:</strong> Esta es una reseña de ejemplo sobre la película. La película tiene una trama interesante y actuaciones sobresalientes.</p>

                            {/* Calificación */}
                            <div className="rating">
                                <strong>Calificación:</strong>
                                <select value={rating} onChange={handleRatingChange} className="rating-select">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>

                            {/* Aprobación de la reseña */}
                            <div className="approval">
                                <strong>Aprobar reseña:</strong>
                                <button onClick={toggleApproval} className={`approve-btn ${approved ? 'approved' : ''}`}>
                                    {approved ? 'Aprobada' : 'No Aprobada'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
