// Ye file transactions se related saare URLs (endpoints) define karti hai

const express = require('express');
const router = express.Router();

const { issueBook, returnBook, getAllTransactions } = require('../controllers/transactionController');

router.get('/', getAllTransactions);      // Saari transactions dekho
router.post('/issue', issueBook);         // Book issue karo
router.put('/return/:id', returnBook);    // Book return karo

module.exports = router;