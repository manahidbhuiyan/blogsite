const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../model/AuthModel')

exports.protect = asyncHandler(async (req, res, next) =>{
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    // else if(req.cookies.token){
    //     token = req.cookies.token
    // }

//    check token exist or not
    if(!token){
        return next(
            new ErrorResponse(`not authorised for this routes`,401)
        )
    }

    try {
        //    verify jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded.id)
        req.user = await User.findById(decoded.id)
        next()
    }
    catch (err){
        return next(
            new ErrorResponse(`not authorised for this routes`,401)
        )
    }
})

// grant access to specified route for specified role
exports.authorize = (...roles) =>{
    return (req, res, next) =>{
        if (!roles.includes(req.user.role)){
            return next(new ErrorResponse(`this user role ${req.user.role} not access to commit this route`),403)
        }
        else {
            next()
        }
    }

}