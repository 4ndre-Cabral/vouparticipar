const mongoose = require('mongoose')
const Question = require('../models/question')
const Option = require('../models/questionsType/option')
require('../store/messages')

exports.add = (req, res) => {
  let question = new Question(req.body)
  question._id = new mongoose.Types.ObjectId()
  question.save().then(result => {
    res.status(201).send({
      message: questionMessage.sucess,
      createdQuestion: question
    })
  }).catch(err => {
    res.status(500).send(err)
  })
}

exports.getAll = (req, res) => {
  Question.find()
    .select()
    .exec()
    .then(docs => {
      res.status(200).send({
        count: docs.length,
        questions: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.getbyId = (req, res) => {
  const questionId = req.params.questionId
  Question.findById(questionId)
    .populate({
      path: 'options',
      model: 'Option'
    })
    .exec()
    .then(docs => {
      res.status(200).send({
        Question: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.update = (req, res) => {
  const questionId = req.params.questionId
  Question.updateOne({ _id: questionId }, { $set: req.body })
    .exec()
    .then(docs => {
      res.status(200).send({
        message: questionMessage.update,
        Question: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.delete = async (req, res) => {
  const questionId = req.params.questionId.split(',')
  const questionResponse = await Question.findById(questionId)
    .populate({
      path: 'options',
      model: 'Option'
    })
    .exec()
  const question = questionResponse.toObject()
  let options = []
  question.options.forEach(option => {
    options.push(option._id.toString())
  })
  let promises = []
  if (options.length > 0) promises.push(Option.deleteMany({ _id: {$in : options} }).exec())
  promises.push(Question.deleteMany({ _id: {$in : questionId} }).exec())
  Promise.all(promises).then(result => {
    res.status(200).send(questionMessage.delete)
  }).catch(err => {
    res.status(500).send(err)
  })
}