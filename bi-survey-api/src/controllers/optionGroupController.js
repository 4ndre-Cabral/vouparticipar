const mongoose = require('mongoose')
const OptionGroup = require('../models/optionGroup')
const Option = require('../models/questionsType/option')
const userController = require('../controllers/userController')
require('../store/messages')

exports.add = (req, res) => {
  let optionGroup = new OptionGroup(req.body)
  optionGroup._id = new mongoose.Types.ObjectId()
  optionGroup.save().then(result => {
    res.status(201).send({
      message: optionMessage.sucess,
      createdOption: optionGroup
    })
  }).catch(err => {
    res.status(500).send(err)
  })
}

exports.getAll = async (req, res) => {
  const userId = req.get('userId')
  const filter = await userController.getFilterByUserId(userId)
  OptionGroup.find(filter)
    .populate({
      path: 'options'
    })
    .select()
    .exec()
    .then(docs => {
      res.status(200).send({
        count: docs.length,
        options: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.getbyId = (req, res) => {
  const optionGroupId = req.params.optionGroupId
  OptionGroup.findById(optionGroupId)
    .populate({
      path: 'options'
    })
    .exec()
    .then(docs => {
      res.status(200).send({
        OptionGroup: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.update = (req, res) => {
  const optionGroupId = req.params.optionGroupId
  OptionGroup.updateOne({ _id: optionGroupId }, { $set: req.body })
    .exec()
    .then(docs => {
      res.status(200).send({
        message: optionMessage.update,
        OptionGroup: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.delete = (req, res) => {
  const optionGroupId = req.params.optionGroupId
  OptionGroup.findById(optionGroupId)
    .populate({
      path: 'options'
    })
    .exec()
    .then(result => {
      const optionGroup = result.toObject()
      let options = []
      optionGroup.options.forEach(option => {
        options.push(option._id.toString())
      })
      Option.deleteMany({ _id: {$in : options} })
      .exec()
      .then(docs => {
        OptionGroup.deleteMany({ _id: {$in : optionGroupId} })
          .exec()
          .then(docs => {
            res.status(200).send({
              message: optionMessage.delete,
              OptionGroup: docs
            })
          })
          .catch(err => {
            res.status(500).send(err)
          })
      })
      .catch(err => {
        res.status(500).send(err)
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}