const express = require('express');
const { 
  getAllStaff, 
  createStaff, 
  updateStaff, 
  toggleStaffStatus, 
  resetPassword 
} = require('../controllers/staff.controller');
const { authenticate, authorizeLibrarian } = require('../middlewares/auth.middleware');

const router = express.Router();

// All staff routes require authentication and LIBRARIAN role
router.use(authenticate);
router.use(authorizeLibrarian);

router.get('/', getAllStaff);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.patch('/:id/status', toggleStaffStatus);
router.patch('/:id/reset-password', resetPassword);

module.exports = router;
