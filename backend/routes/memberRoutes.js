const express = require('express');
const router = express.Router();

const { getAllMembers, addMember, updateMember, deleteMember } = require('../controllers/memberController');
const protect = require('../middleware/authMiddleware');   // NAYI LINE

router.get('/', getAllMembers);                  // Sab dekh sakte hain
router.post('/', protect, addMember);             // Protected
router.put('/:id', protect, updateMember);        // Protected
router.delete('/:id', protect, deleteMember);     // Protected

module.exports = router;