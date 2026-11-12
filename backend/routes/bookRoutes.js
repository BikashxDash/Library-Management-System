const express = require('express');
const router = express.Router();

const { getAllBooks, getBookById, addBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { validateBook } = require('../middleware/validationMiddleware');

router.get('/', getAllBooks);                                        // Public - list & search books
router.get('/:id', getBookById);                                     // Public - view single book
router.post('/', protect, isAdmin, validateBook, addBook);            // Admin only - add book
router.put('/:id', protect, isAdmin, validateBook, updateBook);       // Admin only - update book
router.delete('/:id', protect, isAdmin, deleteBook);                 // Admin only - delete book

module.exports = router;
