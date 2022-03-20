import express from 'express';
import { getAllPosts, createOnePost, findOnePost } from '../controllers/post.controller';

const router = express.Router();

router.get('/', getAllPosts);

router.post('/', createOnePost);

router.get('/:id', findOnePost);

module.exports = router;
