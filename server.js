const express = require('express')
const dotenv = require('dotenv')
const postRoute = require('./routes/postRoutes')
const authRoute = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error')
// const asyncHandler = require('./middleware/async')
const connectDB = require('./config/db')

//load env var file
dotenv.config({ path: './config/config.env' })

//connect database
connectDB()

const PORT = process.env.PORT || 3000

const app = express()

//body persr
app.use(express.json())
//cookie parser
app.use(cookieParser())

//define routes
app.use('/api/post',postRoute)
app.use('/api/auth',authRoute)

//error
app.use(errorHandler)
// app.use(asyncHandler)


app.listen(PORT, () => {
    console.log(`App running on ${process.env.NODE_ENV} mode on port ${PORT}`)
});