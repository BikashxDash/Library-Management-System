// Ye file backend se baat karne ka central point hai
// Saare API calls yahin se hoke jayenge, taaki URL ek jagah manage ho

import axios from 'axios';

// Base URL - backend kaha chal raha hai
const API_BASE_URL = 'http://localhost:5000/api';

// Axios ka ek "instance" banaya, taaki baar baar poora URL na likhna pade
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Books se related saare API calls

// Saari books lao (search/filter ke saath bhi)
export const getBooks = (params = {}) => api.get('/books', { params });

// Ek specific book lao
export const getBookById = (id) => api.get(`/books/${id}`);

// Nayi book add karo
export const addBook = (bookData, token) =>
  api.post('/books', bookData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Book update karo
export const updateBook = (id, bookData, token) =>
  api.put(`/books/${id}`, bookData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Book delete karo
export const deleteBook = (id, token) =>
  api.delete(`/books/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default api;