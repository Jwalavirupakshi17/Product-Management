import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../Services/api';

const ProductList = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products from the API.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(deletingId);
      setProducts(products.filter(p => p.productId !== deletingId));
      setDeletingId(null);
    } catch (err) {
      alert('Error deleting product.');
    }
  };

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (error) return <div className="alert alert-danger shadow-sm border-0"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>;

  return (
    <div>
      <div className="modern-card p-3 mb-4 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <i className="bi bi-funnel text-muted me-2"></i>
          <span className="fw-medium me-3">Filter by Category:</span>
          <select 
            className="form-select w-auto border-0 bg-light" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Grocery">Grocery</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <span className="text-muted small">{filteredProducts.length} items found</span>
      </div>

      <div className="modern-card overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox fs-1 d-block mb-3"></i>
            <h5>No products found</h5>
            <p className="small">Try adjusting your filters or add a new product.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status / Stock</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.productId}>
                    <td className="fw-medium text-dark">{product.productName}</td>
                    <td>
                      <span className="badge bg-light text-secondary border border-secondary-subtle">
                        {product.category}
                      </span>
                    </td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-2">{product.stockQuantity} in stock</span>
                        {product.stockQuantity < 5 && (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">
                            <i className="bi bi-arrow-down-circle me-1"></i>Low Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-end pe-4">
                      <button 
                        className="btn btn-icon text-primary border-0 me-1" 
                        onClick={() => onEdit(product.productId)}
                        title="Edit Product"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-icon text-danger border-0" 
                        onClick={() => setDeletingId(product.productId)}
                        title="Delete Product"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deletingId && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-body p-4 text-center">
                <div className="text-danger mb-3">
                  <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4 className="fw-bold mb-2">Delete Product</h4>
                <p className="text-muted mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>
                <div className="d-flex justify-content-center gap-3">
                  <button type="button" className="btn btn-light px-4" onClick={() => setDeletingId(null)}>Cancel</button>
                  <button type="button" className="btn btn-danger px-4" onClick={confirmDelete}>Yes, Delete it</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;