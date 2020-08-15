const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')

router.post('/',
    userController.userValidationRules(),
    userController.validation,
    userController.addUser
)

module.exports = router