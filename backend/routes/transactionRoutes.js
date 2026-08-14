const express = require('express');
const router = express.Router();

const { issueBook, returnBook, getAllTransactions } = require('../controllers/transactionController');
const protect = require('../middleware/authMiddleware');   // NAYI LINE

router.get('/', getAllTransactions);              // Dekhna sabke liye open
router.post('/issue', protect, issueBook);         // Protected
router.put('/return/:id', protect, returnBook);    // Protected

module.exports = router;