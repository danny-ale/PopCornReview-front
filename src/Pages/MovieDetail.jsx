import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Badge, Tab, Tabs, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaThumbsUp, FaThumbsDown, FaArrowLeft, FaEdit } from 'react-icons/fa';
import '../css/MovieDetail.css';
import YouTubeVideo from '../Components/YouTubeVideo';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

const movieData = {
  id: null,
  title: "",
  image: "",
  year: null,
  director: "",
  rating: 0,
  approval: 0,
  duration: "",
  trailer: "",
  genre: [],
  cast: [],
  synopsis: "",
  reviews: []
};


export default function MovieDetail() {
  const { userId, movieId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [review, setReview] = useState({ rating: 0, comment: '', liked: null });
  const [comments, setComments] = useState({}); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState(movieData.reviews);
  const [movie, setMovie] = useState(movieData);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(movie?.isFavorite || false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const fetchMovieDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(
        `http://localhost:3001/popCornReview/getDetailMovie/${userId}/${movieId}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Error al obtener detalles de la película');
      }

      const apiData = await response.json();
      
      const transformedData = {
        id: apiData.data.pelicula.Id,
        title: apiData.data.pelicula.Titulo,
        image: apiData.data.pelicula.Portada 
          ? `data:image/jpeg;base64,${arrayBufferToBase64(apiData.data.pelicula.Portada.data)}` 
          : 'https://via.placeholder.com/300x450?text=No+Image',
        year: apiData.data.pelicula.Año_Lanzamiento,
        director: apiData.data.pelicula.Director,
        rating: parseFloat(apiData.data.pelicula.Promedio_Estrellas) || 0,
        approval: apiData.data.pelicula.Porcentaje_Pos 
          ? parseFloat(apiData.data.pelicula.Porcentaje_Pos) 
          : 0,
        duration: `${apiData.data.pelicula.Duración_Min} min`,
        trailer: extractYoutubeId(apiData.data.pelicula.Trailer),
        genre: [apiData.data.pelicula.Nombre_Categoria],
        cast: processCast(apiData.data.pelicula.Reparto),
        synopsis: apiData.data.pelicula.Sinopsis,
        reviews: apiData.data.resenas.map(review => ({
          id: review.IdReseña,
          author: review.Nombre_Usuario,
          rating: review.Calificación,
          date: new Date(review.Fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          comment: review.Contenido,
          likes: review.Recomendada === 1 ? 1 : 0,
          dislikes: review.Recomendada === 0 ? 1 : 0,
          userComments: review.comentarios.map(comment => ({
            id: comment.IdComentario,
            author: comment.Nombre_Usuario || `Usuario ${comment.Id_Usuario}`,
            comment: comment.Contenido,
            date: new Date(comment.Fecha).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }))
        })),
        isFavorite: apiData.data.pelicula.EstaEnFavoritos === 1
      };
      setMovie(transformedData);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [userId, movieId]);


  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };


  const extractYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };


  const processCast = (reparto) => {
    if (!reparto) return [];
    return reparto.split(',').map(actor => {
      const [name] = actor.split(' as ').map(s => s.trim());
      return {
        name: name || actor.trim()
      };
    });
  };


  const handleBack = () => {
    navigate(-1);
  };

  const handleRatingClick = (rating) => {
    setReview({ ...review, rating });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData?.userId;
    const userName = userData?.name;
  
    if (!userId) {
      console.log('No hay userId');
      return;
    }

    if (review.rating === 0 || review.comment.trim() === '' || review.liked === null) {
      toast.warn('Por favor completa todos los campos de la reseña: calificación, comentario y si recomiendas la película', {
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
      return; 
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3001/popCornReview/create/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          idUsuario: userId,
          idPelicula: movie.id,
          calificacion: review.rating,
          contenido: review.comment,
          recomendada: review.liked
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al crear la reseña');
      }
  
      await response.json();
      const tempId = Date.now();
  
      fetchMovieDetails();
  
      setReview({
        rating: 0,
        comment: '',
        liked: null
      });
  
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hubo un error al enviar tu reseña', {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentChange = (reviewId, value) => {
    setComments(prev => ({
      ...prev,
      [reviewId]: value
    }));
  };

  const handleCommentSubmit = async (reviewId, e) => {
    e.preventDefault();
    
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData?.userId;
    const userName = userData?.name;
  
    if (!userId) {
      console.log('Debes iniciar sesión para comentar');
      return;
    }
  
    const commentText = comments[reviewId] || '';
  
    if (!commentText.trim()) {
      toast.error('El comentario no puede estar vacío', {
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
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3001/popCornReview/create/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          idUsuario: userId,
          idReseña: reviewId,
          contenido: commentText
        })
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el comentario');
      }
  
      await response.json();
      const tempId = Date.now();
  
      setMovie(prevMovie => ({
        ...prevMovie,
        reviews: prevMovie.reviews.map(r => {
          if (r.id === reviewId) {
            return {
              ...r,
              userComments: [
                {
                  id: tempId, 
                  author: userName,
                  comment: commentText,
                  date: new Date().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                },
                ...r.userComments
              ]
            };
          }
          return r;
        })
      }));
  
      setComments(prev => {
        const newComments = {...prev};
        delete newComments[reviewId];
        return newComments;
      });
  
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hubo un error al enviar tu comentario.', {
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
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
    ));
  };

  const toggleFavorite = async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData?.userId;
  
    if (!userId) {
      toast.error('Debes iniciar sesión para gestionar favoritos.', {
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
      return;
    }
  
    setIsFavoriteLoading(true);
  
    try {
      const endpoint = movie?.isFavorite ? 'http://localhost:3001/popCornReview/remove/favorite' : 'http://localhost:3001/popCornReview/create/favorite';
      const method = movie?.isFavorite ? 'DELETE' : 'POST';
  
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          idUsuario: userId,
          idPelicula: movie.id
        })
      });
  
      if (!response.ok) {
        throw new Error(`Error al ${movie?.isFavorite ? 'eliminar' : 'agregar'} favorito`);
      }
  
      setIsFavorite(!movie?.isFavorite);
      
      setMovie(prev => ({
        ...prev,
        isFavorite: !movie?.isFavorite
      }));
  
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Hubo un error al ${movie?.isFavorite ? 'quitar' : 'agregar'} la película de favoritos`, {
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
    } finally {
      setIsFavoriteLoading(false);
    }
  };


  
  return (
    <div className="body-home">
       <div className="d-flex flex-row">
         <div className='py-5 px-4'>
            <Button variant="light" onClick={handleBack} className="w-2">
            <FaArrowLeft className="me-2" /> Volver 
            </Button>
         </div>

        <Container className="py-4 d-flex flex-column">
            {loading ? (
            <div className="text-center py-5">
                <Spinner animation="border" variant="light" />
            </div>
            ) : (
            <>
                <Row className="mb-4">
                <Col lg={4} className="mb-4 mb-lg-0 position-relative">
                    <Card className="bg-dark text-white border-light h-100">
                    <Button 
                        variant="link" 
                        className={`position-absolute top-0 end-0 p-2 favorite-btn ${movie?.isFavorite ? 'text-danger' : 'text-white'}`}
                        onClick={toggleFavorite}
                        aria-label={movie?.isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                        disabled={isFavoriteLoading}
                      >
                        {isFavoriteLoading ? (
                          <Spinner as="span" animation="border" size="sm" />
                        ) : movie?.isFavorite ? (
                          <FaHeart size={24} />
                        ) : (
                          <FaRegHeart size={24} />
                        )}
                      </Button>
                      
                      <Card.Img variant="top" src={movie.image} alt={movie.title} />
                      <Card.Body className="text-center">
                        <Badge bg="danger" className="fs-5 mb-2">
                          {movie.rating.toFixed(1)}/5.0
                        </Badge>
                        <div className="mb-2 text-warning">
                          {[...Array(5)].map((_, i) => (
                            i < Math.round(movie.rating) ? <FaStar key={i} /> : <FaRegStar key={i} />
                          ))}
                        </div>
                        <Badge bg="success" className="fs-6 mb-3">
                          {movie.approval}% de aprobación
                        </Badge>
                        
                        <Button 
                          variant={movie?.isFavorite ? "outline-danger" : "outline-light"} 
                          onClick={toggleFavorite}
                          className="mt-2 d-flex align-items-center justify-content-center gap-2 w-100"
                          disabled={isFavoriteLoading}
                        >
                          {isFavoriteLoading ? (
                            <Spinner as="span" animation="border" size="sm" />
                          ) : movie?.isFavorite ? (
                            <>
                              <FaHeart /> En favoritos
                            </>
                          ) : (
                            <>
                              <FaRegHeart /> Agregar a favoritos
                            </>
                          )}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                <Col lg={8}>
                    <Card className="bg-dark text-white border-light h-100">
                    <Card.Body>
                        <Card.Title as="h1" className="mb-3">{movie.title} ({movie.year})</Card.Title>
                        
                        <div className="d-flex flex-wrap gap-2 mb-3">
                        {movie.genre.map((g, i) => (
                            <Badge key={i} bg="secondary">{g}</Badge>
                        ))}
                        <Badge bg="danger">{movie.duration}</Badge>
                        </div>
                        
                        <Card.Subtitle className="mb-3 text-muted">Director: {movie.director}</Card.Subtitle>
                        
                        <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-3"
                        fill
                        >
                        <Tab eventKey="details" title="Detalles">
                            <div className="mt-3">
                            <h5 className="mb-3">Sinopsis</h5>
                            <p>{movie.synopsis}</p>
                            
                            <h5 className="mb-3 mt-4">Reparto</h5>
                            <Row>
                                {movie.cast.map((person, i) => (
                                <Col key={i} sm={6} md={4} className="mb-2">
                                    <strong>{person.name}</strong>
                                </Col>
                                ))}
                            </Row>
                            <YouTubeVideo videoId={movie.trailer} />
                            </div>
                        </Tab>
                        <Tab eventKey="reviews" title={`Reseñas (${movie?.reviews?.length || 0})`}>
                            <div className="mt-3">
                            {movie?.reviews?.length > 0 ? (
                                <ListGroup variant="flush">
                                {movie?.reviews?.map((r) => (
                                    <ListGroup.Item key={r.id} className="bg-dark text-white border-secondary">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div>
                                        <strong>{r.author}</strong> - {r.date}
                                        </div>
                                        <div className="text-warning">
                                        {renderStars(r.rating)}
                                        </div>
                                    </div>
                                    <p>{r.comment}</p>
                                    
                                    <div className="d-flex align-items-center mb-3 gap-2">
                                        <span>La recomienda:</span>
                                        <Button variant="outline-success" size="sm" className="me-2" style={{ pointerEvents: 'none', backgroundColor: 'transparent', borderColor: 'green', color: 'green' }}>
                                        <FaThumbsUp className="me-1" /> {r.likes}
                                        </Button>
                                        <Button variant="outline-danger" size="sm" className="me-3" style={{ pointerEvents: 'none', backgroundColor: 'transparent', borderColor: 'red', color: 'red' }}>
                                        <FaThumbsDown className="me-1" /> {r.dislikes}
                                        </Button>
                                    </div>
                                    
                                    <h6 className="mb-2">Comentarios:</h6>
                                    {r.userComments.length > 0 ? (
                                        <ListGroup variant="flush" className="mb-3">
                                        {r.userComments.map((c) => (
                                            <ListGroup.Item key={c.id} className="bg-secondary text-white mb-2 rounded">
                                            <div className="d-flex justify-content-between">
                                                <strong>{c.author}</strong>
                                                <small className="text-light">{c.date}</small>
                                            </div>
                                            <p className="mb-0">{c.comment}</p>
                                            </ListGroup.Item>
                                        ))}
                                        </ListGroup>
                                    ) : (
                                        <p className="text-muted">No hay comentarios aún</p>
                                    )}
                                    
                                    <Form onSubmit={(e) => handleCommentSubmit(r.id, e)}>
                                    <Form.Group className="mb-3">
                                      <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Escribe tu comentario..."
                                        value={comments[r.id] || ''}
                                        onChange={(e) => handleCommentChange(r.id, e.target.value)}
                                        required
                                      />
                                    </Form.Group>
                                    <Button variant="outline-light" size="sm" type="submit">
                                      <FaEdit className="me-1" /> Comentar
                                    </Button>
                                  </Form>
                                    </ListGroup.Item>
                                ))}
                                </ListGroup>
                            ) : (
                                <Alert variant="info">No hay reseñas aún. Sé el primero en opinar.</Alert>
                            )}
                            </div>
                        </Tab>
                        </Tabs>
                    </Card.Body>
                    </Card>
                </Col>
                </Row>
                
                {/* Formulario para nueva reseña */}
                <Card className="bg-dark text-white border-light mb-4">
                  <Card.Body>
                    <Card.Title as="h4">Escribe tu reseña</Card.Title>
                    <Form onSubmit={handleReviewSubmit}>
                      <div className='d-flex flex-row justify-content-between'>
                        <Form.Group className="mb-3  d-flex flex-row gap-4 ">
                          <Form.Label>Calificación:</Form.Label>
                          <div className="d-flex mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Button
                                key={star}
                                variant="outline-warning"
                                type="button"
                                className="me-2"
                                onClick={() => handleRatingClick(star)}
                              >
                                {star <= review.rating ? <FaStar /> : <FaRegStar />}
                              </Button>
                            ))}
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3 d-flex flex-row gap-4 ">
                          <Form.Label>¿Recomiendas esta película?</Form.Label>
                          <div className="d-flex mb-2">
                            <Button
                              variant={review.liked ? "success" : "outline-success"}
                              className="me-2"
                              onClick={() => setReview({...review, liked: true})}
                              type="button"
                            >
                              <FaThumbsUp /> Like
                            </Button>
                            <Button
                              variant={review.liked === false ? "danger" : "outline-danger"}
                              onClick={() => setReview({...review, liked: false})}
                              type="button"
                            >
                              <FaThumbsDown /> Dislike
                            </Button>
                          </div>
                        </Form.Group>
                      </div>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Reseña:</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Escribe tu opinión sobre la película..."
                          value={review.comment}
                          onChange={(e) => setReview({...review, comment: e.target.value})}
                          required
                        />
                      </Form.Group>
                      
                      <Button variant="danger" type="submit" disabled={isSubmitting || review.rating === 0|| review.liked === null}>
                        {isSubmitting ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                            Enviando...
                          </>
                        ) : (
                          "Publicar reseña"
                        )}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
            </>
            )}
        </Container>
      </div>
    </div>
  );
}