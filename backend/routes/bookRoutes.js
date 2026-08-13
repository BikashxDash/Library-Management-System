// Ye file books se related saare URLs (endpoints) define karti hai

const express = require('express');
const router = express.Router();  // Router banaya - chhota sa mini-app jaisa

const { getAllBooks, addBook, updateBook, deleteBook } = require('../controllers/bookController');  // Controller import kiya

// Jab koi GET request "/api/books" pe aayegi, to getAllBooks function chalega
router.get('/', getAllBooks);

// Jab koi POST request "/api/books" pe aayegi, to addBook function chalega
router.post('/', addBook);

// Jab koi PUT request "/api/books/:id" pe aayegi, to updateBook function chalega
router.put('/:id', updateBook);

// DELETE request ke liye bhi route banaya
router.delete('/:id', deleteBook);  

module.exports = router;