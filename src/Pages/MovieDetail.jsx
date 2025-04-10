import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Badge, Tab, Tabs, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown, FaArrowLeft, FaEdit } from 'react-icons/fa';
import '../css/MovieDetail.css';

// Datos de ejemplo para la película
const movieData = {
  id: 1,
  title: "Oppenheimer",
  image: "https://www.eyeforfilm.co.uk/images/stills/o/oppenheimer_2023_poster.jpg",
  year: 2023,
  director: "Christopher Nolan",
  rating: 4.8,
  approval: 95,
  duration: "180 min",
  genre: ["Biografía", "Drama", "Histórico"],
  cast: [
    { name: "Cillian Murphy", role: "J. Robert Oppenheimer" },
    { name: "Emily Blunt", role: "Kitty Oppenheimer" },
    { name: "Matt Damon", role: "Leslie Groves" },
    { name: "Robert Downey Jr.", role: "Lewis Strauss" },
    { name: "Florence Pugh", role: "Jean Tatlock" }
  ],
  synopsis: "La historia del físico J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica durante la Segunda Guerra Mundial. Una mirada intensa a su vida, sus contribuciones y las consecuencias morales de su trabajo.",
  reviews: [
    {
      id: 1,
      author: "María González",
      rating: 5,
      date: "2023-08-15",
      comment: "Una obra maestra del cine moderno. Nolan supera todas las expectativas con esta biografía intensa y visualmente impresionante.",
      likes: 124,
      dislikes: 3,
      userComments: [
        { id: 1, author: "Juan Pérez", comment: "Totalmente de acuerdo, la actuación de Cillian Murphy es increíble", date: "2023-08-16" },
        { id: 2, author: "Ana López", comment: "La escena de la prueba Trinity es de lo mejor que he visto en cine", date: "2023-08-17" }
      ]
    },
    {
      id: 2,
      author: "Carlos Ruiz",
      rating: 4,
      date: "2023-08-20",
      comment: "Excelente película aunque un poco larga. La fotografía y el sonido son espectaculares, merece verse en IMAX.",
      likes: 89,
      dislikes: 7,
      userComments: [
        { id: 3, author: "Laura Méndez", comment: "A mí también me pareció un poco larga, pero vale cada minuto", date: "2023-08-21" }
      ]
    }
  ]
};

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState(movieData.reviews);

  // Simular carga de datos de la API
  const [movie, setMovie] = useState(movieData);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRatingClick = (rating) => {
    setReview({ ...review, rating });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío a API
    setTimeout(() => {
      const newReview = {
        id: reviews.length + 1,
        author: "Tú",
        rating: review.rating,
        date: new Date().toISOString().split('T')[0],
        comment: review.comment,
        likes: 0,
        dislikes: 0,
        userComments: []
      };
      
      setReviews([...reviews, newReview]);
      setReview({ rating: 0, comment: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCommentSubmit = (reviewId, e) => {
    e.preventDefault();
    
    const updatedReviews = reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          userComments: [
            ...r.userComments,
            {
              id: r.userComments.length + 1,
              author: "Tú",
              comment: comment,
              date: new Date().toISOString().split('T')[0]
            }
          ]
        };
      }
      return r;
    });
    
    setReviews(updatedReviews);
    setComment('');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
    ));
  };

  return (
    <div className="body-home">
      <Container className="py-4">
        <Button variant="outline-light" onClick={handleBack} className="mb-4">
          <FaArrowLeft className="me-2" /> Volver
        </Button>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="light" />
          </div>
        ) : (
          <>
            <Row className="mb-4">
              <Col lg={4} className="mb-4 mb-lg-0">
                <Card className="bg-dark text-white border-light">
                  <Card.Img variant="top" src={movie.image} alt={movie.title} />
                  <Card.Body className="text-center">
                    <Badge bg="danger" className="fs-5 mb-2">
                      {movie.rating.toFixed(1)}/5.0
                    </Badge>
                    <div className="mb-2">
                      {renderStars(Math.round(movie.rating))}
                    </div>
                    <Badge bg="success" className="fs-6">
                      {movie.approval}% de aprobación
                    </Badge>
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
                      <Badge bg="info">{movie.duration}</Badge>
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
                                <strong>{person.name}</strong> como {person.role}
                              </Col>
                            ))}
                          </Row>
                        </div>
                      </Tab>
                      <Tab eventKey="reviews" title={`Reseñas (${reviews.length})`}>
                        <div className="mt-3">
                          {reviews.length > 0 ? (
                            <ListGroup variant="flush">
                              {reviews.map((r) => (
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
                                  
                                  <div className="d-flex align-items-center mb-3">
                                    <Button variant="outline-success" size="sm" className="me-2">
                                      <FaThumbsUp className="me-1" /> {r.likes}
                                    </Button>
                                    <Button variant="outline-danger" size="sm" className="me-3">
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
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
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
                  <Form.Group className="mb-3">
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
                  
                  <Button variant="danger" type="submit" disabled={isSubmitting || review.rating === 0}>
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
  );
}