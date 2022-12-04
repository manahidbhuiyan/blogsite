const crypto = require('crypto')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendMail')
const User = require('../model/AuthModel')

//@desc     Register user
//@route    POST api/auth/register
//@access   public
exports.getRegister = asyncHandler(async (req, res, next) =>{

    const { name, email, password, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    setCookieParser(user,200, res)
})

//@desc     LogIn user
//@route    POST api/auth/login
//@access   public
exports.getLogin = asyncHandler(async (req, res, next) =>{

    const { email, password } = req.body

    if(!email || !password){
        next( new ErrorResponse(`Please provide email and password`,401) )
    }

    const user = await User.findOne({email}).select('+password')

    if(!user){
        next( new ErrorResponse(`Invalid credentials`,404) )
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch){
        next( new ErrorResponse(`Password didn't match`,401) )
    }

    setCookieParser(user,200, res)
})

// // Get token from model, create cookie and send response
// const sendTokenResponse = (user, statusCode, res) =>{
// //    create token
//     let token = user.getSignjwtToken()
//
//     const options = {
//         expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRE * 24 * 60 * 60 * 1000),
//         httpOnly: true
//     }
//     if (process.env.NODE_ENV === 'production'){
//         options.secure = true;
//     }
//     res
//         .status(statusCode)
//         .cookie('token',token,options)
//         .json({
//             success: true,
//             token: token
//         })
// }

//@desc     Current user
//@route    GET api/auth/me
//@access   public
exports.getMe = asyncHandler(async (req, res, next) =>{

    const user = await User.findById(req.user.id)

    if(!user){
        next( new ErrorResponse(`User not found`,404) )
    }

    setCookieParser(user,200, res)
})

//@desc     Update user
//@route    PUT api/auth/:id
//@access   public
exports.updateUser = asyncHandler(async (req, res, next) =>{
    req.body.user = req.params.id
    const userFields = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.body.user, userFields, {
        new: true,
        runValidators: true
    })
    if (!user){
        if(!user){
            next( new ErrorResponse(`User not found`,404) )
        }
    }
    setCookieParser(user,200, res)
})

//@desc     Update Password
//@route    GET api/auth/updatePassword/:id
//@access   public
exports.updatePassword = asyncHandler(async (req, res, next) =>{
    console.log("user id",req.user.id)

    const user = await User.findById(req.user.id).select('+password')

    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse(`Password is incorrect`,401))
    }

    user.password = req.body.newPassword
    await user.save()


    setCookieParser(user,200, res)
})

//@desc     Forgot Password
//@route    POST api/auth/forgotPassword
//@access   public
exports.forgotPassword = asyncHandler(async (req, res, next) =>{

    const user = await User.findOne({email: req.body.email})
    if (!user){
        return next(new ErrorResponse(`No user found with this email ${req.body.email}`,404))
    }
    // get reset tokem
    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    //create reset url
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/api/auth/resetPassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }

    //
    // res.status(200).json({
    //     success: true,
    //     msg: 'current user',
    //     data: user
    // })
})

//@desc     reset password
//@route    PUR api/auth/resetPassword/:resetToken
//@access   public
exports.resetPassword = asyncHandler(async (req, res, next) =>{
    let resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt : Date.now() }
    })

    if (!user){
        return next(new ErrorResponse(`Invalid Token`,400))
    }

    // set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    setCookieParser(user,200, res)
})


// set cookie for user token
const setCookieParser = (user, statusCode, res) =>{
//    create token
    const token = user.getSignjwtToken()

//    option
    const options = {
        expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRE_WITH * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            data: user
        })
}