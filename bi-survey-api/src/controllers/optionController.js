const mongoose = require('mongoose')
const Option = require('../models/questionsType/option')
require('../store/messages')

exports.add = (req, res) => {
  let option = new Option(req.body)
  option._id = new mongoose.Types.ObjectId()
  option.save().then(result => {
    res.status(201).send({
      message: optionMessage.sucess,
      createdOption: option
    })
  }).catch(err => {
    res.status(500).send(err)
  })
}

// Save one or more documents to the database. Does new MyModel(doc).save() for every doc
exports.create = (req, res) => {
  const itens = req.body.options
  let options = []
  itens.forEach(item => {
    let option = new Option(item)
    option._id = new mongoose.Types.ObjectId()
    options.push(option)
  });
  Option.create(options).then(result => {
    res.status(201).send({
      message: optionMessage.sucess,
      createdOption: result
    })
  }).catch(err => {
    res.status(500).send(err)
  })
}

exports.getAll = (req, res) => {
  Option.find()
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
  const optionId = req.params.optionId
  Option.findById(optionId)
    .exec()
    .then(docs => {
      res.status(200).send({
        Option: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.update = (req, res) => {
  const optionId = req.params.optionId
  Option.updateOne({ _id: optionId }, { $set: req.body })
    .exec()
    .then(docs => {
      res.status(200).send({
        message: optionMessage.update,
        Option: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.delete = (req, res) => {
  const optionId = req.params.optionId.split(',')
  Option.deleteMany({ _id: {$in : optionId} })
    .exec()
    .then(docs => {
      res.status(200).send({
        message: optionMessage.delete,
        Option: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}