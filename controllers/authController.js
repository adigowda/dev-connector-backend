const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const JWT_SECRET = process.env.JWT_SECRET

const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        res.status(500).json({ msg: 'Server error' })
    }
}

const userValidationRules = () => {
    return [
        body('email', 'Please enter a vald email').isEmail(),
        body('password', 'Please enter a password').not().isEmpty()
    ]
}

const validation = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).send({ errors })
    next()
}

const getTokenForLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        let user = await User.findOne({ email })
        if (!user)
            return res.status(400).send({ errors: [{ message: 'Invalid credentials' }] })

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch)
            return res.status(400).send({ errors: [{ message: 'Invalid credentials' }] })

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
            })

    } catch (error) {
        res.sendStatus(500).json({ msg: 'Server error' })
    }
}

module.exports = { getUserDetails, userValidationRules, validation, getTokenForLogin }