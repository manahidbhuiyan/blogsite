const express = require('express')
const { getAllPost, getSinglePost, createPost, getUpdatePost, getDeletePost } = require('../controller/postController')
const router = express.Router()
router
    .route('/')
    .get(getAllPost)
    .post(createPost)

router
    .route('/:id')
    .get(getSinglePost)
    .put(getUpdatePost)
    .delete(getDeletePost)

module.exports = router