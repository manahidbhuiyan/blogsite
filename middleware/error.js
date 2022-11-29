const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) =>{
    let error = {...err}
    error.message = err.message

    // log for dev
    console.log(err)

    // mongoose bad request

    if (err.name == 'CastError'){
        const message = `Resource not found with this id ${err.value}`
        error = new ErrorResponse(message, 404)
    }
    if (err.code == 11000){
        const message = `Duplicate value`
        error = new ErrorResponse(message, 404)
    }
    if(err.name == 'validationError'){
        const message = Object.values(err.errors).map(value => value.message)
        error = new ErrorResponse(message, 404)
    }

    res.status( error.statusCode || 500).json({
        success: false,
        error: error.message || 'server error'
    })
    next()
}
module.exports = errorHandler