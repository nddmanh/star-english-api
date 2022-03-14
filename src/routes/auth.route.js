const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/auth.controller');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, getCurrentUser);

router.post('/register', register);

router.post('/login', login);

module.exports = router;
