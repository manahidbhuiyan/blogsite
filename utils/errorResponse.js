class ErrorResponse extends Error{
    // statusCode = Number
    // message = String

    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode
        // this.message = message
    }
}
module.exports = ErrorResponse