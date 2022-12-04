const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const Posts = require('../model/postModel')
const User = require('./authController')

//@desc     find all post
//@route    GET /api/post/all
//@access   public
exports.getAllPost= asyncHandler(async (req, res, next) => {
        const post = await Posts.find()
        if (!post) {
            res.status(400).json({
                success: false,
                msg: 'could not find post'
            })
        }
        res.status(200).json({
            success: true,
            count: post.length,
            data: post
        })
})

//@des      find single post
//@route    GET /api/post/:id
//@access   public
exports.getSinglePost = asyncHandler(async (req, res, next) =>{
        const post = await Posts.findById(req.params.id)
        if (!post) {
            next(new ErrorResponse(`Post not found with this id ${req.params.id}`, 404))
        }
        res.status(200).json({
            success: true,
            msg: 'find Single Post',
            data: post
        })
})

// @desc   create Posts
// @route  POST /api/post
// @access Private
exports.createPost = asyncHandler(async (req, res, next) =>{

        const { title, description } = req.body
        req.body.user = req.user.id

        console.log(req.body)
        const post = await Posts.create(req.body)

        const result = await Posts.findById(post._id).populate({path:'user',select:'name role'})
    console.log(req.user)
        // if(!req.user.role === 'admin' || !req.user.role === 'publisher'){
        //     return next(new ErrorResponse(`only admin and publisher can create post`,401))
        // }

        res.status(201).json({
            success: true,
            msg: 'create post',
            data: result
        })
})

//@des      update single post
//@route    PUT /api/post/:id
//@access   public
exports.getUpdatePost = asyncHandler(async (req, res, next) =>{
        const post = await Posts.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        if(!post){
            return next(new ErrorResponse(`could not post find this id`,404))
        }

        res.status(200).json({
            success: true,
            msg: 'update single post',
            data: post
        })
})

//@des      Delete single post
//@route    PUT /api/post/:id
//@access   public
exports.getDeletePost = asyncHandler(async (req, res, next) =>{
       const post = await Posts.findByIdAndDelete(req.params.id)
       if(!post){
           next(new ErrorResponse(`could not find this id`,404))
       }
       res.status(200).json({
           success: true,
           msg: `delete post with id ${req.params.id}`
       })
})