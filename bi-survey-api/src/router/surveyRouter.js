const express = require('express')
const surveyController = require('../controllers/surveyController')
const checkAuth = require('../middleware/check-auth')

const router = new express.Router()

router.post('/', checkAuth, surveyController.add)

router.post('/duplicate', checkAuth, surveyController.duplicate)

router.get('/', checkAuth, surveyController.getAll)

router.get('/user', checkAuth, surveyController.getAllWithUser)

router.get('/user/:userId', checkAuth, surveyController.getAllWithUserByUserId)

router.get('/:surveyId', surveyController.getbyId)

router.patch('/:surveyId', checkAuth, surveyController.update)

router.delete('/:surveyId', surveyController.delete)

module.exports = router