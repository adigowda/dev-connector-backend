const express = require('express')
const router = express.Router()
const isAuthenticated = require('../../middleware/auth')
const authController = require('../../controllers/authController')

router.get(
    '/',
    isAuthenticated,
    authController.getUserDetails
)

router.post(
    '/',
    authController.userValidationRules(),
    authController.validation,
    authController.getTokenForLogin
)

module.exports = router