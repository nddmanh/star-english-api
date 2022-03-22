import express from 'express';
import { updateScore } from '../controllers/user.controller';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.patch('/update-score', verifyToken, updateScore);

module.exports = router;
