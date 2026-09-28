import React, { useState } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';

function App() {
  const [currentView, setCurrentView] = useState('list');
  const [editingProductId, setEditingProductId] = useState(null);

  const handleAddNew = () => {
    setEditingProductId(null);
    setCurrentView('form');
  };

  const handleEdit = (id) => {
    setEditingProductId(id);
    setCurrentView('form');
  };

  const handleFormClose = () => {
    setCurrentView('list');
    setEditingProductId(null);
  };

  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container">
          <span className="navbar-brand fw-bold text-primary d-flex align-items-center">
            <i className="bi bi-box-seam me-2"></i>
            Product Management System
          </span>
          <div className="d-flex align-items-center">
            <span className="text-muted small"><i className="bi bi-person-circle me-1"></i> Admin user</span>
          </div>
        </div>
      </nav>

      <div className="container mt-4 pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0 fw-bold text-dark">
            {currentView === 'list' ? 'Product Catalog' : (editingProductId ? 'Edit Product' : 'Create Product')}
          </h3>
          {currentView === 'list' && (
            <button className="btn btn-primary d-flex align-items-center shadow-sm" onClick={handleAddNew}>
              <i className="bi bi-plus-lg me-2"></i> Add New Product
            </button>
          )}
        </div>

        {currentView === 'list' ? (
          <ProductList onEdit={handleEdit} />
        ) : (
          <ProductForm productId={editingProductId} onClose={handleFormClose} />
        )}
      </div>
    </div>
  );
}

export default App;