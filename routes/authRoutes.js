const express = require('express')
const auth = require('../middleware/auth');
const { getRegister, getLogin, getMe, updateUser, updatePassword, forgotPassword, resetPassword } = require('../controller/authController')
const router = express.Router()
const { protect, authorize } = require('../middleware/auth')

router.post('/register',getRegister)
router.post('/login',getLogin)
router.get('/me', protect, getMe)
router.put('/updateUser/:id',protect, updateUser)
// router.put('/updatePassword', updatePassword)
router.put('/updatePassword', protect, updatePassword)
router.post('/forgotPassword', forgotPassword)

router
    .route('/resetPassword/:resetToken')
    .put(resetPassword)


module.exports = router