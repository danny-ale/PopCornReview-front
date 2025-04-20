import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdOutlineComment } from "react-icons/md";
import '../css/ListaReview.css';

const List_CommentMovies = ({ comment, onEditComment, onDeleteComment }) => {
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSave = (id) => {
    onEditComment({ id, review: editedCommentText });
    setEditingComment(null);
  };

  return (
    <section className="reviews-section">
      <div className="section-header">
        <h2><MdOutlineComment className="section-icon" /> Comentarios Recientes</h2>
        <span className="count-badge">{comment.length} comentarios</span>
      </div>
      
      {comment.map(comment => (
        <div key={comment.id} className="review-card">
          <div className="comment-meta">
            <span className="comment-user">{comment.userName || 'Anónimo'}</span>
            <span className="comment-date">{formatDate(comment.reviewDate)}</span>
          </div>
          
          <div className="review-comment">
            {editingComment === comment.id ? (
              <>
                <textarea
                  className="edit-review-textarea"
                  value={editedCommentText}
                  onChange={(e) => setEditedCommentText(e.target.value)}
                  rows="4"
                />
                <div className="review-edit-actions">
                  <button 
                    className="action-btn save-btn"
                    onClick={() => handleSave(comment.id)}
                  >
                    Guardar
                  </button>
                  <button 
                    className="action-btn cancel-btn"
                    onClick={() => setEditingComment(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <p>{comment.review}</p>
            )}
          </div>
          
          {editingComment !== comment.id && (
            <div className="review-actions">
              <button 
                className="action-btn delete-btn"
                onClick={() => onDeleteComment('comment', comment.id)}
              >
                <FaTrash /> Eliminar
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

List_CommentMovies.propTypes = {
    comment: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      userName: PropTypes.string,
      review: PropTypes.string.isRequired,
      reviewDate: PropTypes.string.isRequired
    })
  ).isRequired,
  onEditComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired
};

export default List_CommentMovies;