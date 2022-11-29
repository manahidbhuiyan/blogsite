
const ErrorResponse = require('../utils/errorResponse')
const Posts = require('../model/postModel')

//@desc     find all post
//@route    GET /api/post/all
//@access   public
exports.getAllPost= async (req, res, next) => {
    try{
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
    }
    catch (err){
       next()
    }
}

//@des      find single post
//@route    GET /api/post/:id
//@access   public
exports.getSinglePost = async (req, res, next) =>{
    try{
        const post = await Posts.findById(req.params.id)
        if (!post) {
            next(new ErrorResponse(`Post not found with this id ${req.params.id}`, 404))
        }
        res.status(200).json({
            success: true,
            msg: 'find Single Post',
            data: post
        })
    }
    catch (err){
        next(err)
    }
}

// @desc   create Posts
// @route  POST /api/post
// @access Private
exports.createPost = async (req, res, next) =>{
    try{
        const { title, description } = req.body
        const post = await Posts.create({
            title,
            description
        })

        res.status(201).json({
            success: true,
            msg: 'create post',
            data: post
        })
    }
    catch (err){
        next(err)
    }
}

//@des      update single post
//@route    PUT /api/post/:id
//@access   public
exports.getUpdatePost = async (req, res, next) =>{

    res.status(200).json({
        success: true,
        msg: 'update single post'
    })
}
//@des      Delete single post
//@route    PUT /api/post/:id
//@access   public
exports.getDeletePost = async (req, res, next) =>{
   try{
       const post = await Posts.findByIdAndDelete(req.params.id)
       if(!post){
           next(new ErrorResponse(`could not find this id`,404))
       }
       res.status(200).json({
           success: true,
           msg: `delete post with id ${req.params.id}`
       })
   }
   catch (err){
       next(err)
   }
}