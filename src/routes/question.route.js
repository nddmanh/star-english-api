import express from 'express';
import { getQuestions, createOneQuestion } from '../controllers/question.controller';

const router = express.Router();

router.get('/', getQuestions);

router.post('/', createOneQuestion);

module.exports = router;
