import React, { useState, useEffect } from 'react';
import { createProduct, getProductById, updateProduct } from '../Services/api';

const ProductForm = ({ productId, onClose }) => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '', 
    price: '',
    stockQuantity: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(productId);

  useEffect(() => {
    if (isEditMode) loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const response = await getProductById(productId);
      setFormData(response.data);
    } catch (err) {
      setApiError('Failed to load product details.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName.trim()) newErrors.productName = 'Product name is required.';
    if (!formData.category) newErrors.category = 'Category is required.';
    if (Number(formData.price) <= 0) newErrors.price = 'Price must be greater than zero.';
    if (Number(formData.stockQuantity) < 0 || formData.stockQuantity === '') newErrors.stockQuantity = 'Stock cannot be negative.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10)
      };

      if (isEditMode) {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.title || 'An error occurred while saving the product.';
      setApiError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modern-card mx-auto" style={{ maxWidth: '700px' }}>
      <div className="p-4 border-bottom bg-light bg-opacity-50 rounded-top-3">
        <h5 className="mb-0 fw-bold d-flex align-items-center">
          <i className={`bi ${isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'} text-primary me-2`}></i>
          {isEditMode ? 'Update Product Information' : 'Enter Product Details'}
        </h5>
        <p className="text-muted small mb-0 mt-1">Fill out the fields below to {isEditMode ? 'update' : 'create'} the product record.</p>
      </div>
      
      <div className="p-4">
        {apiError && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{apiError}</div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-12">
              <label className="form-label fw-medium text-dark">Product Name <span className="text-danger">*</span></label>
              <input 
                type="text" 
                className={`form-control ${errors.productName ? 'is-invalid border-danger' : ''}`}
                name="productName" 
                value={formData.productName} 
                onChange={handleChange} 
                placeholder="e.g. Wireless Headphones"
              />
              {errors.productName && <div className="invalid-feedback">{errors.productName}</div>}
            </div>

            <div className="col-md-12">
              <label className="form-label fw-medium text-dark">Category <span className="text-danger">*</span></label>
              <select 
                className={`form-select ${errors.category ? 'is-invalid border-danger' : ''}`}
                name="category" 
                value={formData.category} 
                onChange={handleChange}
              >
                <option value="" disabled>Select a category...</option>
                <option value="Electronics">Electronics</option>
                <option value="Grocery">Grocery</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium text-dark">Unit Price ($) <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0"><i className="bi bi-currency-dollar"></i></span>
                <input 
                  type="number" 
                  step="0.01" 
                  className={`form-control border-start-0 ${errors.price ? 'is-invalid border-danger' : ''}`}
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  placeholder="0.00"
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium text-dark">Stock Quantity <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0"><i className="bi bi-boxes"></i></span>
                <input 
                  type="number" 
                  className={`form-control border-start-0 ${errors.stockQuantity ? 'is-invalid border-danger' : ''}`}
                  name="stockQuantity" 
                  value={formData.stockQuantity} 
                  onChange={handleChange} 
                  placeholder="0"
                />
                {errors.stockQuantity && <div className="invalid-feedback">{errors.stockQuantity}</div>}
              </div>
            </div>
          </div>

          <hr className="my-4 text-muted" />

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light px-4 border" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-4 shadow-sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
              ) : (
                <><i className="bi bi-check2-circle me-2"></i>Save Product</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;