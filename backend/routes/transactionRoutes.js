const express = require('express');
const router = express.Router();

const { issueBook, returnBook, getAllTransactions } = require('../controllers/transactionController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, getAllTransactions);              // Protected: admin sees all, member sees own
router.post('/issue', protect, isAdmin, issueBook);        // Admin only - issue book
router.put('/return/:id', protect, isAdmin, returnBook);   // Admin only - return book

module.exports = router;
