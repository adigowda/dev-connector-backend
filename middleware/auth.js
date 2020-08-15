const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const isAuthenticated = (req, res, next) => {
    const token = req.headers.token
    if (!token) {
        return res.status(401).json({ msg: 'No token found' })
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded.user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ msg: 'Invalid token' })
    }
}

module.exports = isAuthenticated