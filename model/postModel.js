// getting-started.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
       title:{
           type: String,
           required: [true, 'please add a title'],
           unique: true,
           trim: true,
           maxlength: [50, 'Title must not be more than 50 characters']
       },
        description:{
           type: String,
           required: [true, 'please add description'],
           maxlength: [500, 'Title must not be more than 50 characters']
       },
        createdAt: {
            type: Date,
            default: Date.now
        },
        user:{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        }
    }
)

module.exports = mongoose.model('Posts',postSchema)