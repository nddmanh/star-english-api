import express from 'express';
import { updateScore, leaderboard } from '../controllers/user.controller';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.patch('/update-score', verifyToken, updateScore);

router.get('/leaderboard', verifyToken, leaderboard);

module.exports = router;
