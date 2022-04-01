import express from 'express';
import { register, login, getCurrentUser, verifyEmail, loginGoogle } from '../controllers/auth.controller';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.get('/', verifyToken, getCurrentUser);

router.post('/register', register);

router.post('/login', login);

router.post('/google', loginGoogle);

router.get('/verify-email', verifyEmail);

module.exports = router;
