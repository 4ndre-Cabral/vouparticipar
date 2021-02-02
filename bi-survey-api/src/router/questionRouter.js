const express = require('express')
const questionController = require('../controllers/questionController')

const router = new express.Router()

router.post('/', questionController.add)

router.get('/', questionController.getAll)

router.get('/:questionId', questionController.getbyId)

router.patch('/:questionId', questionController.update)

router.delete('/:questionId', questionController.delete)

module.exports = router