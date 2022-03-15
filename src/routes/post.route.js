import express from 'express';
import { getAllPosts, createOnePost } from '../controllers/post.controller';

const router = express.Router();

router.get('/', getAllPosts);

router.post('/', createOnePost);

module.exports = router;
