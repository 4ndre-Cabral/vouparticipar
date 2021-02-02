const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
const User = require('../models/user')
const mongoose = require('mongoose')
require('../store/messages')

exports.signup = (req, res) => {
  try {
    console.log(req.body)
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err
        })
      } else {
        // MongoDb
        // TODO: fix error email
        // const user = new User({
        //   _id: new mongoose.Types.ObjectId(),
        //   name: req.body.name,
        //   cpf: req.body.cpf,
        //   login: req.body.cpf,
        //   email: req.body.cpf,
        //   password: hash,
        //   userRole: []
        // })
        // user.userRole.push(req.body.userRole)
        let user = new User(req.body)
        user._id = new mongoose.Types.ObjectId()
        user.password = hash
        console.log(user)
        user.save().then(result => {
          res.status(201).send({
            message: userMessage.sucess,
            createdUser: user
          })
        }).catch(err => {
          console.log('erro aq')
          res.status(500).send(err)
        })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({message: userMessage.error})
  }
}

exports.getAll = (req, res) => {
  User.find()
    .select()
    .populate('userRole')
    .exec()
    .then(docs => {
      res.status(200).send({
        count: docs.length,
        users: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.getById = (req, res) => {
  const userId = req.params.userId
  User.findById(userId)
    .populate('userRole', 'description')
    .exec()
    .then(docs => {
      res.status(200).send({
        user: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}


// TODO: Fix error when userId doesn't exist
exports.update = (req, res) => {
  const userId = req.params.userId
  if (req.body.password) {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err
        })
      } else {
        let user = req.body
        user.password = hash
        User.updateOne({ _id: userId }, { $set: user })
          .exec()
          .then(docs => {
            res.status(200).send({
              user: docs
            })
          })
          .catch(err => {
            res.status(500).send(err)
          })
      }
    })
  } else {
    User.updateOne({ _id: userId }, { $set: req.body })
      .exec()
      .then(docs => {
        res.status(200).send({
          user: docs
        })
      })
      .catch(err => {
        res.status(500).send(err)
      })
  }
}

exports.delete = (req, res) => {
  const userId = req.params.userId
  User.deleteOne({ _id: userId })
    .exec()
    .then(docs => {
      res.status(200).send({
        user: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

// Para Super Adminitrador o filter é undefined
exports.getFilterByUserId = async (userId) => {
  const userResult = await User.findById(userId).populate('userRole', 'description').exec()
  const user = userResult.toObject()
  const userRole = user.userRole[0]
  let filter
  if (userRole.description === 'Administrador') {
    filter = {
      ownerUser: userId
    }
  }
  if (userRole.description === 'Cliente') {
    filter = {
      user: userId
    }
  }
  return filter
}