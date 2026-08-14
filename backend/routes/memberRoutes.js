const express = require('express');
const router = express.Router();

const { getAllMembers, getMemberById, addMember, updateMember, deleteMember } = require('../controllers/memberController');
const protect = require('../middleware/authMiddleware');   // NAYI LINE

router.get('/', getAllMembers);                  // Sab dekh sakte hain
router.get('/:id', getMemberById);               // Sab dekh sakte hain, login zaroori nahi
router.post('/', protect, addMember);             // Protected
router.put('/:id', protect, updateMember);        // Protected
router.delete('/:id', protect, deleteMember);     // Protected

module.exports = router;