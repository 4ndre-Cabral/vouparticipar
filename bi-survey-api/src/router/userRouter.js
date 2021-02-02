const express = require('express')
const userController = require('../controllers/userController')
const checkAuth = require('../middleware/check-auth')

const router = new express.Router()

router.post('/signup', userController.signup)

router.get('/', checkAuth,  userController.getAll)

router.get('/:userId', checkAuth, userController.getById)

router.patch('/:userId', checkAuth, userController.update)

router.delete('/:userId', checkAuth, userController.delete)

module.exports = router