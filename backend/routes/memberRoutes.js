const express = require('express');
const router = express.Router();

const { getAllMembers, getMemberById, addMember, updateMember, deleteMember } = require('../controllers/memberController');
const protect = require('../middleware/authMiddleware');  
const { validateMember } = require('../middleware/validationMiddleware');

router.get('/', getAllMembers);                   // Sab dekh sakte hain
router.get('/:id', getMemberById);                // Sab dekh sakte hain, login zaroori nahi
router.post('/', protect, validateMember, addMember);             // Protected
router.put('/:id', protect, validateMember, updateMember);        // Protected
router.delete('/:id', protect, deleteMember);     // Protected

module.exports = router;