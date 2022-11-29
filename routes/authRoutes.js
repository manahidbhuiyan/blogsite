const express = require('express')
const { getRegister } = require('../controller/authController')
const router = express.Router()

router
    .route('/register')
    .post(getRegister)

module.exports = router