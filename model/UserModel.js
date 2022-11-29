const mongoose = require('mongoose')

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
module.exports = mongoose.model("User", userSchema)
