const mongoose = require('mongoose')
var SimpleCrypto = require("simple-crypto-js").default
const Answer = require('../models/answer')
const utilDate = require('../util/dateUtil')

exports.add = (req, res) => {
  let simpleCrypto = new SimpleCrypto('7qxgQLHYFj4wBYUVXLJdm8Q1AAnoLkU4lQLNEQJR')
  const answerDecryted = simpleCrypto.decrypt(req.body.content)

  Answer.find({
    $and: [
      { 'survey': answerDecryted.survey },
      { 'userIp': answerDecryted.userIp },
      { 'userId': answerDecryted.userId }
    ]
  })
    .exec()
    .then(docs => {
      if (docs.length === 0) {
        let answer = new Answer(answerDecryted)
        answer._id = new mongoose.Types.ObjectId()
        answer.save().then(result => {
          res.status(201).send({
            message: 'Questionario respondido com sucesso!'
          })
        }).catch(err => {
          res.status(500).send(err)
        })
      } else {
        res.status(200).send({
          count: docs.length,
          Answer: docs
        })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })

}

exports.getAll = (req, res) => {
  Answer.find()
    .populate({
      path: 'question',
      path: 'options'
    })
    .select()
    .exec()
    .then(docs => {
      res.status(200).send({
        count: docs.length,
        answers: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.getbySurveyId = (req, res) => {
  const surveyId = req.params.surveyId
  const initialDate = req.query.initialDate ? utilDate.getDateFromString(req.query.initialDate) : new Date(0)
  const finalDate = req.query.finalDate ? utilDate.getDateFromString(req.query.finalDate) : new Date()
  Answer.find().where({date: {$gte: initialDate, $lte: finalDate}})
    .all('survey', surveyId)
    .populate({
      path: 'question',
      path: 'options'
    })
    .exec()
    .then(docs => {
      res.status(200).send({
        count: docs.length,
        Answer: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.getTotalAnswersbySurveyId = (req, res) => {
  const surveyId = req.params.surveyId
  Answer.where('survey', surveyId)
    .count()
    .then(docs => {
      res.status(200).send({
        total: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.getIfAlreadyExist = (req, res) => {
  console.log(req.body)
  Answer.find({
    $and: [
      { 'survey': req.body.id },
      { 'userId': req.body.userId },
      { 'userIp': req.body.userIp }
    ]
  })
    .exec()
    .then(docs => {
      res.status(200).send({
        count: docs.length,
        Answer: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.delete = (req, res) => {
  const answerId = req.params.answerId
  Answer.deleteMany({ _id: {$in : answerId} })
  .exec()
  .then(docs => {
    res.status(200).send('Resposta deletada com sucesso!')
  })
  .catch(err => {
    res.status(500).send(err)
  })
}
