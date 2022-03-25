import express from 'express';
import { findWord } from '../controllers/dictionary.controller';
const router = express.Router();

router.get('/:word', findWord);

module.exports = router;