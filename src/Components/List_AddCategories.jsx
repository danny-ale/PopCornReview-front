import React from 'react';
import PropTypes from 'prop-types';
import { FaFolder, FaList, FaHeart, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import '../css/ListaReview.css';

const List_AddCategories = ({ 
  categories, 
  onEditCategory, 
  onDeleteCategory, 
  navigateToCreateCategory 
}) => {
  return (
    <section className="custom-categories-section">
      <div className="section-header">
        <h2><FaFolder className="section-icon" /> Mis Categorías</h2>
        <button 
          className="add-category-btn" 
          onClick={navigateToCreateCategory}
        >
          <FaPlus /> Nueva Categoría
        </button>
      </div>
      
      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-header">
              <h3>{category.name}</h3>
              <span className={`visibility-badge ${category.isPublic ? 'public' : 'private'}`}>
                {category.isPublic ? 'Pública' : 'Privada'}
              </span>
            </div>
            <p className="category-description">{category.description}</p>
            <div className="category-footer d-flex flex-column">
              <div className="category-stats">
                <div className="stat-item">
                  <FaList />
                  <span>{category.movieCount} películas</span>
                </div>
                <div className="stat-item">
                  <FaHeart />
                  <span>{category.followers} seguidores</span>
                </div>
              </div>
              <div className="category-actions d-flex flex-column gap-3">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => onEditCategory(category)}
                >
                  <FaEdit /> Editar
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => onDeleteCategory('customCategories', category.id)}
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

List_AddCategories.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      movieCount: PropTypes.number.isRequired,
      isPublic: PropTypes.bool.isRequired,
      followers: PropTypes.number.isRequired
    })
  ).isRequired,
  onEditCategory: PropTypes.func.isRequired,
  onDeleteCategory: PropTypes.func.isRequired,
  navigateToCreateCategory: PropTypes.func.isRequired
};

export default List_AddCategories;