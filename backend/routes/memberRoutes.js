const express = require('express');
const router = express.Router();

const { getAllMembers, getMemberById, addMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect, isAdmin } = require('../middleware/authMiddleware');  
const { validateMember } = require('../middleware/validationMiddleware');

router.get('/', protect, getAllMembers);                              // Protected: admin sees all, member sees own
router.get('/:id', protect, getMemberById);                           // Protected: admin or own profile
router.post('/', protect, isAdmin, validateMember, addMember);        // Admin only
router.put('/:id', protect, isAdmin, validateMember, updateMember);   // Admin only
router.delete('/:id', protect, isAdmin, deleteMember);                // Admin only

module.exports = router;
