const express = require('express');
const { hello } = require('../controllers/auth.controller');
const router = express.Router();
// const argon2 = require('argon2');
// const jwt = require('jsonwebtoken');

// const { login, register, getCurrentUser } = require('./../controllers/authController');
// const verifyToken = require('../middleware/auth');

// router.get('/', verifyToken, getCurrentUser);

// router.post('/register', register);

// router.post('/login', login)

router.get('/', hello);


module.exports = router