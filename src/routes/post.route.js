const express = require('express');
const router = express.Router();
// const verifyToken = require('../middleware/auth');

const { getAllPosts, createOnePost } = require('../controllers/post.controller');

// router.get('/', verifyToken, getAllPosts);

// router.post('/', verifyToken, createOnePost);

// router.put('/:id', verifyToken, updateOnePost);

// router.delete('/:id', verifyToken, deleteOnePost);

router.get('/', getAllPosts);

router.post('/', createOnePost);

module.exports = router;
