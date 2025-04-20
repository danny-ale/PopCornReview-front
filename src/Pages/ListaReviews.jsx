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
    const [categories, setCategories] = useState([]); 
    const [loadingCategories, setLoadingCategories] = useState(true);
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


    const processImage = (bufferData) => {
        if (!bufferData || !bufferData.data) return null;
        try {
            const uint8Array = new Uint8Array(bufferData.data);
            let binaryString = '';
            const chunkSize = 8192; 
            
            for (let i = 0; i < uint8Array.length; i += chunkSize) {
                const chunk = uint8Array.subarray(i, i + chunkSize);
                binaryString += String.fromCharCode.apply(null, chunk);
            }
            
            const base64String = btoa(binaryString);
            return `data:image/jpeg;base64,${base64String}`;
        } catch (error) {
            console.error("Error processing image:", error);
            return null;
        }
    };


    const fetchData = async () => {
        fetchCategories();

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
                    duration: movie.Duración_Min,
                    rating: movie.Clasificación,
                    director: movie.Director,
                    cast: movie.Reparto,
                    synopsis: movie.Sinopsis,
                    poster: processImage(movie.Portada),
                    trailer: movie.Trailer,
                    category: movie.NombreCategoria,
                    contributors: 1, 
                    isPublic: true 
                })) || [],
                
                customCategories: categoriesData.data?.map(category => ({
                    id: category.Id,
                    name: category.Nombre,
                    description: category.Descripcion,
                    movieCount: category.CantidadPeliculas, 
                    isPublic: true
                })) || [],
                
                favorites: favoritesData.data?.map(fav => ({
                    id: fav.Id,
                    title: fav.Titulo,
                    year: fav.Año_Lanzamiento,
                    rating: fav.Clasificación,
                    director: fav.Director,
                    poster: processImage(fav.Portada),
                    genres: [fav.Id_categoria],
                    runtime: fav.Duración_Min,
                    userRating: fav.Puntuacion_Media ? parseFloat(fav.Puntuacion_Media) : null,
                    addedDate: fav.Fecha_Agregado 
                })) || [],
                
                reviews: reviewsData.data?.map(review => ({
                    id: review.Id,
                    title: review.Titulo,
                    year: review.Año_Lanzamiento,
                    rating: review.Clasificación,
                    director: review.Director,
                    poster: processImage(review.Portada),
                    genres: [], 
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
            <div class="row g-3">
              <div class="col-md-6">
                <label for="swal-title" class="form-label">Título</label>
                <input id="swal-title" class="form-control swal2-input" value="${movie.title || ''}" placeholder="Título" required>
              </div>
              <div class="col-md-6">
                <label for="swal-director" class="form-label">Director</label>
                <input id="swal-director" class="form-control swal2-input" value="${movie.director || ''}" placeholder="Director">
              </div>
              <div class="col-md-4">
                <label for="swal-year" class="form-label">Año</label>
                <input id="swal-year" class="form-control swal2-input" type="number" 
                       value="${movie.year || ''}" 
                       min="1900" max="${new Date().getFullYear() + 2}" 
                       placeholder="Año">
              </div>
              <div class="col-md-4">
                <label for="swal-duration" class="form-label">Duración (min)</label>
                <input id="swal-duration" class="form-control swal2-input" type="number" 
                       value="${movie.duration || ''}" 
                       min="1" max="600" 
                       placeholder="Duración">
              </div>
              <div class="col-md-4">
                <label for="swal-rating" class="form-label">Clasificación</label>
                <select id="swal-rating" class="form-select swal2-select">
                  <option value="G" ${movie.rating === 'G' ? 'selected' : ''}>G</option>
                  <option value="PG" ${movie.rating === 'PG' ? 'selected' : ''}>PG</option>
                  <option value="PG-13" ${movie.rating === 'PG-13' ? 'selected' : ''}>PG-13</option>
                  <option value="R" ${movie.rating === 'R' ? 'selected' : ''}>R</option>
                </select>
              </div>
              <div class="col-12">
                <label for="swal-cast" class="form-label">Reparto</label>
                <input id="swal-cast" class="form-control swal2-input" 
                       value="${movie.cast || ''}" 
                       placeholder="Actor 1, Actor 2, Actor 3">
              </div>
              <div class="col-12">
                <label for="swal-synopsis" class="form-label">Sinopsis</label>
                <textarea id="swal-synopsis" class="form-control swal2-textarea" rows="3"
                          placeholder="Sinopsis">${movie.synopsis || ''}</textarea>
              </div>
              <div class="col-md-6">
                <label for="swal-trailer" class="form-label">URL del Tráiler</label>
                <input id="swal-trailer" class="form-control swal2-input" type="url"
                       value="${movie.trailer || ''}" 
                       placeholder="https://www.youtube.com/watch?v=...">
              </div>
               <div class="col-md-6">
                <label for="swal-category" class="form-label">Categoría</label>
                <select id="swal-category" class="form-select swal2-select">
                    ${categories.map(category => `
                    <option 
                        value="${category.Id}" 
                        ${movie.Id_categoria == category.Id ? 'selected' : ''}
                        ${!movie.Id_categoria && category.Nombre === movie.category ? 'selected' : ''}
                    >
                        ${category.Nombre}
                    </option>
                    `).join('')}
                </select>
                </div>
            </div>
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
          width: '800px',
          preConfirm: () => {
            const title = document.getElementById('swal-title').value.trim();
            if (!title) {
              Swal.showValidationMessage('El título es requerido');
              return false;
            }
      
            return {
              title: title,
              director: document.getElementById('swal-director').value.trim(),
              year: parseInt(document.getElementById('swal-year').value) || null,
              duration: parseInt(document.getElementById('swal-duration').value) || null,
              rating: document.getElementById('swal-rating').value,
              cast: document.getElementById('swal-cast').value.trim(),
              synopsis: document.getElementById('swal-synopsis').value.trim(),
              trailer: document.getElementById('swal-trailer').value.trim(),
              Id_categoria: document.getElementById('swal-category').value || null,
              category: categories.find(c => c.Id == document.getElementById('swal-category').value)?.Nombre || ''
            };
          },
          didOpen: () => {
            // Añade estilos adicionales
            document.querySelector('.swal2-popup').style.padding = '1.5em';
          }
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              // Aquí deberías implementar la llamada al endpoint de actualización
              const updatedMovie = {
                ...movie,
                ...result.value
              };
      
              // Ejemplo de llamada API (debes implementar tu propia función)
              // await updateMovieAPI(movie.id, updatedMovie);
      
              // Actualización del estado local
              setLists(prev => ({
                ...prev,
                addedMovies: prev.addedMovies.map(m => 
                  m.id === movie.id ? updatedMovie : m
                )
              }));
              
              Swal.fire({
                title: '¡Actualizado!',
                text: 'La película ha sido editada correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            } catch (error) {
              Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar la película: ' + (error.message || ''),
                icon: 'error'
              });
            }
          }
        });
      };
    const handleEditCategory = (category) => {
        Swal.fire({
            title: 'Editar Categoría',
            html: `
            <div class="col-md">
               <input id="swal-name" class="form-control  swal2-input" value="${category.name}" placeholder="Nombre">
                <textarea id="swal-description" class="form-control swal2-textarea" placeholder="Descripción">${category.description}</textarea>
           </div>
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