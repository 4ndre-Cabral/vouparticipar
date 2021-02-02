const express = require('express')
const optionController = require('../controllers/optionController')

const router = new express.Router()

router.post('/', optionController.add)

router.post('/saveAll', optionController.create)

router.get('/', optionController.getAll)

router.get('/:optionId', optionController.getbyId)

router.patch('/:optionId', optionController.update)

router.delete('/:optionId', optionController.delete)

module.exports = router