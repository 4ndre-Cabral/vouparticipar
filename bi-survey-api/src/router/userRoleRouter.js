const express = require('express')
const userRoleController = require('../controllers/userRoleController')
require('../store/messages')
// const checkAuth = require('../middleware/check-auth')

const router = new express.Router()

router.post('/', userRoleController.add)

router.get('/', userRoleController.getAll)

router.get('/:userRoleId?', userRoleController.getbyId)

router.patch('/:userRoleId', userRoleController.update)

router.delete('/:userRoleId', userRoleController.delete)

module.exports = router