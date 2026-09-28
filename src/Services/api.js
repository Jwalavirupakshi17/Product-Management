import axios from 'axios';

// Update the port to 7227 to match Swagger
const API_BASE_URL = 'https://localhost:7277/api/products'; 

export const getProducts = () => axios.get(API_BASE_URL);
export const getProductById = (id) => axios.get(`${API_BASE_URL}/${id}`);
export const createProduct = (product) => axios.post(API_BASE_URL, product);
export const updateProduct = (id, product) => axios.put(`${API_BASE_URL}/${id}`, product);
export const deleteProduct = (id) => axios.delete(`${API_BASE_URL}/${id}`);