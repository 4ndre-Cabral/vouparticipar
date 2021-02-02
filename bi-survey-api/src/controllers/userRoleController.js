const mongoose = require('mongoose')
const UserRole = require('../models/userRole')
require('../store/messages')

exports.add = (req, res) => {
  console.log(req.body)
  let userRole = new UserRole(req.body)
  userRole._id = new mongoose.Types.ObjectId()
  userRole.save().then(result => {
    res.status(201).send({
      message: userRoleMessage.sucess,
      createdUser: userRole
    })
  }).catch(err => {
    console.error(err)
    res.status(500).send(err)
  })
}

exports.getAll = (req, res) => {
  UserRole.find()
    .select()
    .exec()
    .then(docs => {
      res.status(200).send({
        count: docs.length,
        usersRole: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.getbyId = (req, res) => {
  const userRoleId = req.params.userRoleId
  UserRole.findById(userRoleId)
    .exec()
    .then(docs => {
      res.status(200).send({
        UserRole: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.update = (req, res) => {
  const userRoleId = req.params.userRoleId
  UserRole.updateOne({ _id: userRoleId }, { $set: req.body })
    .exec()
    .then(docs => {
      res.status(200).send({
        UserRole: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.delete = (req, res) => {
  const userRoleId = req.params.userRoleId.split(',')
  UserRole.deleteMany({ _id: {$in : userRoleId} })
    .exec()
    .then(docs => {
      res.status(200).send({
        UserRole: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}