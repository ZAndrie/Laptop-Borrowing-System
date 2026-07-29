const express = require('express');
const { 
  getAllBorrowers, 
  registerBorrower, 
  updateBorrower,
  lookupBorrower 
} = require('../controllers/borrower.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

// All borrower routes are accessible to both Librarians and Staff
router.use(authenticate);

router.get('/', getAllBorrowers);
router.get('/lookup/:studentId', lookupBorrower);
router.post('/', registerBorrower);
router.put('/:id', updateBorrower);

module.exports = router;
