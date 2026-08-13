// Ye file members se related saare URLs (endpoints) define karti hai

const express = require('express');
const router = express.Router();

const { getAllMembers, addMember, updateMember, deleteMember } = require('../controllers/memberController');

router.get('/', getAllMembers);
router.post('/', addMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

module.exports = router;