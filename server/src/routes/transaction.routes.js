const express = require('express');
const { 
  getAllTransactions, 
  borrowLaptop 
} = require('../controllers/transaction.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

// Both Staff and Librarians can manage borrowing transactions
router.use(authenticate);

router.get('/', getAllTransactions);
router.post('/borrow', borrowLaptop);

module.exports = router;
