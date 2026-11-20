// Ye file backend se baat karne ka central point hai
// Saare API calls yahin se hoke jayenge, taaki URL ek jagah manage ho

import axios from 'axios';

// Base URL - VITE_API_URL env variable se aata hai (.env file me set karo)
// Fallback: localhost:5000 development ke liye
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios ka ek "instance" banaya, taaki baar baar poora URL na likhna pade
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor: agar request me Authorization header nahi hai to localStorage se token attach karo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to construct headers when token is explicitly passed
const withAuth = (token) => (token ? { headers: { Authorization: `Bearer ${token}` } } : {});

// Books se related saare API calls

// Saari books lao (search/filter ke saath bhi)
export const getBooks = (params = {}) => api.get('/books', { params });

// Ek specific book lao
export const getBookById = (id) => api.get(`/books/${id}`);

// Nayi book add karo
export const addBook = (bookData, token) => api.post('/books', bookData, withAuth(token));

// Book update karo
export const updateBook = (id, bookData, token) => api.put(`/books/${id}`, bookData, withAuth(token));

// Book delete karo
export const deleteBook = (id, token) => api.delete(`/books/${id}`, withAuth(token));

// Dashboard stats lao
export const getDashboardStats = (token) => api.get('/dashboard', withAuth(token));

// Members se related saare API calls

export const getMembers = (token) => api.get('/members', withAuth(token));

export const getMemberById = (id, token) => api.get(`/members/${id}`, withAuth(token));

export const addMember = (memberData, token) => api.post('/members', memberData, withAuth(token));

export const updateMember = (id, memberData, token) => api.put(`/members/${id}`, memberData, withAuth(token));

export const deleteMember = (id, token) => api.delete(`/members/${id}`, withAuth(token));

// Fines se related saare API calls

export const getFines = (token) => api.get('/fines', withAuth(token));

export const payFine = (id, token) => api.put(`/fines/pay/${id}`, {}, withAuth(token));

// Transactions se related API calls

export const getTransactions = (params = {}, token) => api.get('/transactions', { params, ...withAuth(token) });

export const issueBook = (data, token) => api.post('/transactions/issue', data, withAuth(token));

export const returnBook = (transactionId, token) => api.put(`/transactions/return/${transactionId}`, {}, withAuth(token));

// Reservations se related API calls

export const getReservations = (token) => api.get('/reservations', withAuth(token));

export const createReservation = (data, token) => api.post('/reservations', data, withAuth(token));

export const cancelReservation = (id, token) => api.put(`/reservations/cancel/${id}`, {}, withAuth(token));

// Auth - admin-only user management

export const getPendingUsers = (token) => api.get('/auth/pending-users', withAuth(token));

export const approveUser = (id, token) => api.put(`/auth/approve/${id}`, {}, withAuth(token));

export const rejectUser = (id, token) => api.put(`/auth/reject/${id}`, {}, withAuth(token));

export default api;
