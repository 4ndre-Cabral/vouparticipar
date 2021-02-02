const express = require('express')
const optionGroupController = require('../controllers/optionGroupController')

const router = new express.Router()

router.post('/', optionGroupController.add)

router.get('/', optionGroupController.getAll)

router.get('/:optionGroupId', optionGroupController.getbyId)

router.patch('/:optionGroupId', optionGroupController.update)

router.delete('/:optionGroupId', optionGroupController.delete)

module.exports = router