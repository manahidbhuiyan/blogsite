const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:[true, 'please add a name'],
            unique: true,
            trim: true,
            maxlength: [50, 'name not more than 50 characters']
        },
        phone:{
            type: Number,
            maxlength: [true, 'number not more than 20 digits']
        },
        email:{
            type: String,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        role:{
            type: String,
            enum:['user','publisher','admin'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, 'please add password'],
            minLength: [6, 'password must have to atleast 6'],
            select: false
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        createdAt:{
            type: Date,
            default: Date.now
        }
    }
)

// encrypt password using bcrypt
userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
// get json web token and return
userSchema.methods.getSignjwtToken = function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}
//user entered password match with database hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex')

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

//    set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
    return resetToken;
}

module.exports = mongoose.model("User", userSchema)
