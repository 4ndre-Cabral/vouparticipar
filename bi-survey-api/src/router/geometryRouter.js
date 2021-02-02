const express = require('express')
const geometryController = require('../controllers/geometryController')

const router = new express.Router()

router.post('/', geometryController.add)

router.get('/', geometryController.getAll)

router.get('/:geometryId', geometryController.getbyId)

router.get('/all/:geometryId', geometryController.getAllById)

router.patch('/:geometryId', geometryController.update)

router.delete('/:geometryId', geometryController.delete)

module.exports = router