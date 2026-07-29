const express = require('express');
const { login, getProfile, registerUser } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', registerUser);
router.get('/profile', authenticate, getProfile);

module.exports = router;
