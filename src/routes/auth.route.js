import express from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.get('/', verifyToken, getCurrentUser);

router.post('/register', register);

router.post('/login', login);

module.exports = router;
