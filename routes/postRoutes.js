const express = require('express')
const { getAllPost, getSinglePost, createPost, getUpdatePost, getDeletePost } = require('../controller/postController')
const router = express.Router()
const { protect, authorize} = require('../middleware/auth')

router
    .route('/')
    .get(getAllPost)
    .post(protect,authorize('admin','publisher'), createPost)

router
    .route('/:id')
    .get(getSinglePost)
    .put(protect,authorize('admin','publisher'), getUpdatePost)
    .delete(protect,authorize('admin','publisher'), getDeletePost)

module.exports = router