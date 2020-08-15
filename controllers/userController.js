const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const userValidationRules = () => {
    return [
        body('name', 'Name should not be empty').not().isEmpty(),
        body('email', 'Please enter a vald email').isEmail(),
        body('password', 'Password should have a minimum 6 characters').isLength({ min: 6 })
    ]
}

const validation = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).send({ errors })
    next()
}

const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        let user = await User.findOne({ email }).exec()
        if (user)
            return res.status(400).send({ errors: [{ message: 'User already exists' }] })

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        user = new User({
            name,
            email,
            password,
            avatar
        })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: 36000000000000 },
            (err, token) => {
                if (err) throw err
                res.json({
                    token
                })
            }
        )

    } catch (error) {
        console.log(error)
        return res.status(500).send('Server error')
    }
}

module.exports = { userValidationRules, validation, addUser }