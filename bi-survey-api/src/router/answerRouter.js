const express = require('express')
const answerController = require('../controllers/answerController')
const checkAuth = require('../middleware/check-auth')

const router = new express.Router()

router.post('/', answerController.add)

router.get('/', checkAuth, answerController.getAll)

router.post('/allByFilter', answerController.getIfAlreadyExist)

router.get('/totalBySurveyId/:surveyId', answerController.getTotalAnswersbySurveyId)

router.get('/:surveyId', answerController.getbySurveyId)

// router.delete('/:answerId', answerController.delete)

module.exports = router