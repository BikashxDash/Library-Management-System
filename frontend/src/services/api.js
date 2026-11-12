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

// Dashboard stats lao
export const getDashboardStats = (token) =>
  api.get('/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });

// Members se related saare API calls

export const getMembers = (token) =>
  api.get('/members', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMemberById = (id) => api.get(`/members/${id}`);

export const addMember = (memberData, token) =>
  api.post('/members', memberData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateMember = (id, memberData, token) =>
  api.put(`/members/${id}`, memberData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteMember = (id, token) =>
  api.delete(`/members/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Fines se related saare API calls

export const getFines = (token) =>
  api.get('/fines', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const payFine = (id, token) =>
  api.put(`/fines/pay/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Transactions se related API calls

export const getTransactions = (token, params = {}) =>
  api.get('/transactions', {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

export const issueBook = (data, token) =>
  api.post('/transactions/issue', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const returnBook = (transactionId, token) =>
  api.put(`/transactions/return/${transactionId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Reservations se related API calls

export const getReservations = (token) =>
  api.get('/reservations', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createReservation = (data, token) =>
  api.post('/reservations', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const cancelReservation = (id, token) =>
  api.put(`/reservations/cancel/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Auth - admin-only user management

export const getPendingUsers = (token) =>
  api.get('/auth/pending-users', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const approveUser = (id, token) =>
  api.put(`/auth/approve/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const rejectUser = (id, token) =>
  api.put(`/auth/reject/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default api;
