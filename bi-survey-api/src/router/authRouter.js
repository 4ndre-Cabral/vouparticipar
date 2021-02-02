const express = require('express')
const authController = require('../controllers/authController')
const checkAuth = require('../middleware/check-auth')

const router = new express.Router()

router.post('/login', authController.login)

router.post('/loginGoogle', authController.loginGoogle)

router.get('/refresh', checkAuth, authController.refresh)

module.exports = router