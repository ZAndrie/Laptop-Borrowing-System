const express = require('express');
const { 
  getAllLaptops, 
  addLaptop, 
  updateLaptop, 
  deleteLaptop 
} = require('../controllers/laptop.controller');
const { authenticate, authorizeLibrarian } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get all laptops (Accessible to all authenticated users - Librarians & Staff)
router.get('/', authenticate, getAllLaptops);

// Modify laptop inventory (Accessible ONLY to Librarians)
router.post('/', authenticate, authorizeLibrarian, addLaptop);
router.put('/:id', authenticate, authorizeLibrarian, updateLaptop);
router.delete('/:id', authenticate, authorizeLibrarian, deleteLaptop);

module.exports = router;
