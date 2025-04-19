import React, { useState, useEffect } from 'react';
import '../css/ListaReview.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaStar, FaRegStar, FaStarHalfAlt, FaHeart, FaArrowLeft, FaEdit, FaFolder, FaList } from 'react-icons/fa';
import Swal from 'sweetalert2';
import AddedMoviesSection from '../Components/List_AddMovies';
import CustomCategoriesSection from '../Components/List_AddCategories';
import FavoritesSection from '../Components/List_AddFavoritesMovies';
import ReviewsSection from '../Components/List_ReviewMovies';

export default function ListaReview() {
    const navigate = useNavigate();
    const [editingReview, setEditingReview] = useState(null);
    const [editedReviewText, setEditedReviewText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData?.userId;
    const userName = userData?.name ; 
    

    const [lists, setLists] = useState({
        favorites: [],
        reviews: [],
        addedMovies: [],
        customCategories: []
    });


    const processImage = (bufferData) => {
        if (!bufferData || !bufferData.data) return null;
        try {
            const base64String = btoa(
                String.fromCharCode(...new Uint8Array(bufferData.data))
            );
            return `data:image/jpeg;base64,${base64String}`;
        } catch (error) {
            console.error("Error processing image:", error);
            return null;
        }
    };


    const fetchData = async () => {
        if (!userId) {
            setError('Usuario no identificado');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No hay token de autenticación');
            setLoading(false);
            return;
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            setLoading(true);
            

            const moviesResponse = await fetch(
                `http://localhost:3001/popCornReview/getMovies/${userId}`,
                { headers }
            );
            const moviesData = await moviesResponse.json();
            

            const categoriesResponse = await fetch(
                `http://localhost:3001/popCornReview/getCategories/${userId}`,
                { headers }
            );
            const categoriesData = await categoriesResponse.json();
            
  
            const favoritesResponse = await fetch(
                `http://localhost:3001/popCornReview/getFavorites/${userId}`,
                { headers }
            );
            const favoritesData = await favoritesResponse.json();
            

            const reviewsResponse = await fetch(
                `http://localhost:3001/popCornReview/getReviews/${userId}`,
                { headers }
            );
            const reviewsData = await reviewsResponse.json();


            setLists({
                addedMovies: moviesData.data?.map(movie => ({
                    id: movie.Id,
                    title: movie.Titulo,
                    year: movie.Año_Lanzamiento,
                    rating: movie.Clasificación,
                    director: movie.Director,
                    poster: processImage(movie.Portada),
                    genres: [movie.Id_categoria], // Aquí podrías mapear el ID a nombre de categoría
                    runtime: movie.Duración_Min,
                    addedDate: new Date().toISOString(), // No viene en el endpoint, usar fecha actual
                    contributors: 1, // Valor por defecto
                    isPublic: true // Valor por defecto
                })) || [],
                
                customCategories: categoriesData.data?.map(category => ({
                    id: category.Id,
                    name: category.Nombre,
                    description: category.Descripcion,
                    movieCount: 0, // No viene en el endpoint, podrías contar películas por categoría
                    createdDate: new Date().toISOString(), // No viene en el endpoint
                    isPublic: true, // Valor por defecto
                    followers: 0 // Valor por defecto
                })) || [],
                
                favorites: favoritesData.data?.map(fav => ({
                    id: fav.Id,
                    title: fav.Titulo,
                    year: fav.Año_Lanzamiento,
                    rating: fav.Clasificación,
                    director: fav.Director,
                    poster: processImage(fav.Portada),
                    genres: [fav.Id_categoria], // Mapear ID a nombre de categoría
                    runtime: fav.Duración_Min,
                    userRating: fav.Puntuacion_Media ? parseFloat(fav.Puntuacion_Media) : null,
                    addedDate: new Date().toISOString() // No viene en el endpoint
                })) || [],
                
                reviews: reviewsData.data?.map(review => ({
                    id: review.Id,
                    title: review.Titulo,
                    year: review.Año_Lanzamiento,
                    rating: review.Clasificación,
                    director: review.Director,
                    poster: processImage(review.Portada),
                    genres: [], // No viene en el endpoint
                    runtime: review.Duración_Min,
                    review: review.Contenido,
                    userRating: review.Calificación,
                    reviewDate: review.Fecha
                })) || []
            });
            
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Error al cargar los datos del usuario");
            setLoading(false);
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchData();
    }, [userId]);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="star filled" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className="star half-filled" />);
            } else {
                stars.push(<FaRegStar key={i} className="star" />);
            }
        }
        
        return stars;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDelete = async (listType, id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e50914',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Aquí deberías implementar la llamada al endpoint de eliminación
                    // Por ahora solo actualizamos el estado local
                    setLists(prev => ({
                        ...prev,
                        [listType]: prev[listType].filter(item => item.id !== id)
                    }));
                    
                    Swal.fire(
                        '¡Eliminado!',
                        'El elemento ha sido eliminado.',
                        'success'
                    );
                } catch (error) {
                    Swal.fire(
                        'Error',
                        'No se pudo eliminar el elemento',
                        'error'
                    );
                }
            }
        });
    };

    const handleEditReview = (review) => {
        setEditingReview(review.id);
        setEditedReviewText(review.review);
    };

    const saveEditedReview = async (id) => {
        try {
            // Aquí deberías implementar la llamada al endpoint de actualización
            // Por ahora solo actualizamos el estado local
            setLists(prev => ({
                ...prev,
                reviews: prev.reviews.map(review => 
                    review.id === id ? { ...review, review: editedReviewText } : review
                )
            }));
            
            setEditingReview(null);
            Swal.fire('¡Guardado!', 'Tu reseña ha sido actualizada.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar la reseña', 'error');
        }
    };

    const handleEditMovie = (movie) => {
        Swal.fire({
            title: 'Editar Película',
            html: `
                <input id="swal-title" class="swal2-input" value="${movie.title}" placeholder="Título">
                <input id="swal-director" class="swal2-input" value="${movie.director}" placeholder="Director">
                <input id="swal-year" class="swal2-input" type="number" value="${movie.year}" placeholder="Año">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    title: document.getElementById('swal-title').value,
                    director: document.getElementById('swal-director').value,
                    year: document.getElementById('swal-year').value
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Aquí deberías implementar la llamada al endpoint de actualización
                    // Por ahora solo actualizamos el estado local
                    setLists(prev => ({
                        ...prev,
                        addedMovies: prev.addedMovies.map(m => 
                            m.id === movie.id ? { 
                                ...m, 
                                title: result.value.title,
                                director: result.value.director,
                                year: result.value.year
                            } : m
                        )
                    }));
                    
                    Swal.fire('¡Actualizado!', 'La película ha sido editada.', 'success');
                } catch (error) {
                    Swal.fire('Error', 'No se pudo actualizar la película', 'error');
                }
            }
        });
    };

    const handleEditCategory = (category) => {
        Swal.fire({
            title: 'Editar Categoría',
            html: `
                <input id="swal-name" class="swal2-input" value="${category.name}" placeholder="Nombre">
                <textarea id="swal-description" class="swal2-textarea" placeholder="Descripción">${category.description}</textarea>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    name: document.getElementById('swal-name').value,
                    description: document.getElementById('swal-description').value
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Aquí deberías implementar la llamada al endpoint de actualización
                    // Por ahora solo actualizamos el estado local
                    setLists(prev => ({
                        ...prev,
                        customCategories: prev.customCategories.map(c => 
                            c.id === category.id ? { 
                                ...c, 
                                name: result.value.name,
                                description: result.value.description
                            } : c
                        )
                    }));
                    
                    Swal.fire('¡Actualizado!', 'La categoría ha sido editada.', 'success');
                } catch (error) {
                    Swal.fire('Error', 'No se pudo actualizar la categoría', 'error');
                }
            }
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-row">
            <div className='py-5 px-4'>
                <Button variant="light" onClick={handleBack} className="w-2">
                    <FaArrowLeft className="me-2" /> Volver 
                </Button>
            </div>
            <div className="user-reviews-page">
                <header className="user-header">
                    <h1>Perfil de {userName}</h1>
                    <div className="user-stats">
                        <span><FaList /> {lists.addedMovies.length} Agregadas</span>
                        <span><FaEdit /> {lists.reviews.length} Reseñas</span>
                        <span><FaHeart /> {lists.favorites.length} Favoritos</span>
                        <span><FaFolder /> {lists.customCategories.length} Categorías</span>
                    </div>
                </header>     
                <div className="lists-container">
                    <AddedMoviesSection 
                        movies={lists.addedMovies}
                        onEditMovie={handleEditMovie}
                        onDeleteMovie={handleDelete}
                        navigateToCreateMovie={() => navigate('/CrearPelicula')}
                    />

                    <CustomCategoriesSection 
                        categories={lists.customCategories}
                        onEditCategory={handleEditCategory}
                        onDeleteCategory={handleDelete}
                        navigateToCreateCategory={() => navigate('/CrearCategoria')}
                    />

                    <FavoritesSection 
                        favorites={lists.favorites}
                        onDeleteFavorite={handleDelete}
                    />

                    <ReviewsSection 
                        reviews={lists.reviews}
                        onEditReview={({ id, review }) => {
                            setLists(prev => ({
                                ...prev,
                                reviews: prev.reviews.map(r => 
                                    r.id === id ? { ...r, review } : r
                                )
                            }));
                            Swal.fire('¡Guardado!', 'Tu reseña ha sido actualizada.', 'success');
                        }}
                        onDeleteReview={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};