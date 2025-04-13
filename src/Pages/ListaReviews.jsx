import React, { useState } from 'react';
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

    const [lists, setLists] = useState({
        favorites: [
            {
                id: 1,
                title: "El Padrino",
                year: 1972,
                rating: "R",
                director: "Francis Ford Coppola",
                poster: 'https://es.web.img3.acsta.net/pictures/18/06/12/12/12/0117051.jpg?coixp=49&coiyp=27',
                genres: ["Drama", "Crimen"],
                runtime: 175,
                userRating: 5,
                addedDate: "2023-01-15"
            },
            {
                id: 2,
                title: "Parásitos",
                year: 2019,
                rating: "R",
                director: "Bong Joon-ho",
                poster: 'https://m.media-amazon.com/images/S/pv-target-images/2fee9e617ca8af2eed8123c2686040bc355cad4c5ef7d5f4644e9e2bb39d2192.jpg',
                genres: ["Drama", "Thriller"],
                runtime: 132,
                userRating: 4.5,
                addedDate: "2023-03-22"
            }
        ],
        reviews: [
            {
                id: 3,
                title: "El Caballero de la Noche",
                year: 2008,
                rating: "PG-13",
                director: "Christopher Nolan",
                poster: 'https://th.bing.com/th/id/OIP.tTkuHiYFE-EZlz1f2smSwAAAAA?rs=1&pid=ImgDetMain',
                genres: ["Acción", "Drama", "Thriller"],
                runtime: 152,
                review: "Una obra maestra del cine de superhéroes. Heath Ledger ofrece una actuación icónica como el Joker.",
                userRating: 5,
                reviewDate: "2023-05-15"
            },
            {
                id: 4,
                title: "Dune",
                year: 2021,
                rating: "PG-13",
                director: "Denis Villeneuve",
                poster: 'https://th.bing.com/th/id/OIP.u60xVWa9YE6ffmHnm3b8FQHaJQ?rs=1&pid=ImgDetMain',
                genres: ["Ciencia ficción", "Aventura"],
                runtime: 155,
                review: "Impresionante visualmente pero algo lenta en su narrativa. Espero que la segunda parte complete la historia satisfactoriamente.",
                userRating: 4,
                reviewDate: "2023-02-10"
            }
        ],
        addedMovies: [
            {
                id: 5,
                title: "Everything Everywhere All at Once",
                year: 2022,
                rating: "R",
                director: "Daniel Kwan, Daniel Scheinert",
                poster: 'https://assets.dev-filo.dift.io/img/2022/05/11/stqawbsabzh5zoisnevtras7ui.jpeg_344325628.jpeg',
                genres: ["Ciencia ficción", "Aventura", "Comedia"],
                runtime: 139,
                addedDate: "2023-04-10",
                contributors: 12,
                isPublic: true
            },
            {
                id: 6,
                title: "El Proyecto de la Bruja de Blair",
                year: 1999,
                rating: "R",
                director: "Daniel Myrick, Eduardo Sánchez",
                poster: 'https://th.bing.com/th/id/R.a8594e1573779e8b94e264cc44e93e07?rik=x%2bDHMzoJvOnYLw&pid=ImgRaw&r=0',
                genres: ["Terror", "Found footage"],
                runtime: 81,
                addedDate: "2023-02-28",
                contributors: 5,
                isPublic: false
            }
        ],
        customCategories: [
            {
                id: 1,
                name: "Acción",
                description: "Películas llenas de acción y emoción",
                movieCount: 24,
                createdDate: "2022-11-05",
                isPublic: true,
                followers: 156
            },
            {
                id: 2,
                name: "Comedia",
                description: "Películas para reír y pasar un buen rato",
                movieCount: 18,
                createdDate: "2023-01-18",
                isPublic: true,
                followers: 89
            },
            {
                id: 3,
                name: "Occidental",
                description: "Clásicos del western y nuevas interpretaciones",
                movieCount: 42,
                createdDate: "2022-09-30",
                isPublic: false,
                followers: 0
            }
        ]
    });

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
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDelete = (listType, id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e50914',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setLists(prev => ({
                    ...prev,
                    [listType]: prev[listType].filter(item => item.id !== id)
                }));
                Swal.fire(
                    '¡Eliminado!',
                    'El elemento ha sido eliminado.',
                    'success'
                );
            }
        });
    };

    const handleEditReview = (review) => {
        setEditingReview(review.id);
        setEditedReviewText(review.review);
    };

    const saveEditedReview = (id) => {
        setLists(prev => ({
            ...prev,
            reviews: prev.reviews.map(review => 
                review.id === id ? { ...review, review: editedReviewText } : review
            )
        }));
        setEditingReview(null);
        Swal.fire('¡Guardado!', 'Tu reseña ha sido actualizada.', 'success');
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
        }).then((result) => {
            if (result.isConfirmed) {
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
        }).then((result) => {
            if (result.isConfirmed) {
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
            }
        });
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
        <div className="user-reviews-page">
            <header className="user-header">
                <h1>Perfil de UsuarioEjemplo</h1>
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