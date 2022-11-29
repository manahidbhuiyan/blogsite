const User = require('../model/UserModel')

//@desc     Register user
//@route    POST api/auth/register
//@access   public
exports.getRegister = async (req, res, next) =>{

    console.log(req.body)

    const { name, email, password, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    res.status(200).json({
        success: true,
        msg: 'registration done',
        data: user
    })
}