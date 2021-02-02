const mongoose = require('mongoose')
const Survey = require('../models/survey')
const Answer = require('../models/answer')
const Question = require('../models/question')
const Option = require('../models/questionsType/option')
const userController = require('../controllers/userController')
require('../store/messages')

exports.add = (req, res) => {
  let survey = new Survey(req.body)
  survey._id = new mongoose.Types.ObjectId()
  survey.save().then(result => {
    res.status(201).send({
      message: surveyMessage.sucess,
      createdSurvey: survey
    })
  }).catch(err => {
    res.status(500).send(err)
  })
}

exports.duplicate = async (req, res) => {
  const surveyResult = new Survey(req.body)
  let survey = surveyResult.toObject()
  survey._id = new mongoose.Types.ObjectId()
  if (survey.questions.length > 0) {
    let questions = []
    for (let i = 0; i < survey.questions.length; i++) {
      const questionResult = await Question.findById(survey.questions[i])
        .populate({
          path: 'options',
          model: 'Option'
        })
        .exec()
      const question = questionResult.toObject()
      const questaoResult = new Question({
        description: question.description,
        active: question.active,
        type: question.type,
        lastQuestionId: question.lastQuestionId
      })
      let questao = questaoResult.toObject()
      questao._id = new mongoose.Types.ObjectId()
      if (question.options.length > 0) {
        let options = []
        for (let j = 0; j < question.options.length; j++) {
          const option = question.options[j]
          const opcaoResult = new Option({
            label: option.label,
            photoUrl: option.photoUrl
          })
          let opcao = opcaoResult.toObject()
          opcao._id = new mongoose.Types.ObjectId()
          options.push(opcao)
        }
        if (options.length > 0) {
          let optionResult = await Option.create(options)
          optionResult.forEach(opt => {
            questao.options.push(opt.toObject())
          })
        }
      }
      questions.push(questao)
    }
    let questoesResult = await Question.create(questions)
    survey.questions = []
    questoesResult.forEach(question => {
      survey.questions.push(question.toObject())
    })
    Survey.create(survey).then(result => {
      res.status(201).send({
        message: surveyMessage.sucess,
        createdSurvey: survey
      })
    }).catch(err => {
      res.status(500).send(err)
    })
  } else {
    survey.save().then(result => {
      res.status(201).send({
        message: surveyMessage.sucess,
        createdSurvey: survey
      })
    }).catch(err => {
      res.status(500).send(err)
    })
  }
}

exports.getAll = async (req, res) => {
  const userId = req.get('userId')
  const filter = await userController.getFilterByUserId(userId)
  Survey.find(filter)
    .populate({
      path: 'user'
    })
    .select()
    .exec()
    .then(async docs => {
      const promises = []
      const totalList = []
      docs.map(survey => {
        promises.push(
          Answer.where('survey', survey._id)
            .count()
            .then(total => {
              totalList.push({ surveyId: survey._id, total: total })
            })
            .catch(err => {
              res.status(500).send(err)
            })
        )
      })
      await Promise.all(promises)
      res.status(200).send({
        count: docs.length,
        surveys: docs,
        totalList: totalList
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
}

exports.getAllWithUser = (req, res) => {
  Survey.find()
    .populate({
      path: 'user'
    })
    .select()
    .exec()
    .then(async docs => {
      const promises = []
      const totalList = []
      docs.map(survey => {
        promises.push(
          Answer.where('survey', survey._id)
            .count()
            .then(total => {
              totalList.push({ surveyId: survey._id, total: total })
            })
            .catch(err => {
              res.status(500).send(err)
            })
        )
      })
      await Promise.all(promises)
      res.status(200).send({
        count: docs.length,
        surveys: docs,
        totalList: totalList
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
}

exports.getAllWithUserByUserId = (req, res) => {
  Survey.find({ 'user': req.params.userId })
    .populate({
      path: 'user'
    })
    .select()
    .exec()
    .then(docs => {
      res.status(200).send({
        count: docs.length,
        surveys: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}
exports.getbyId = (req, res) => {
  const surveyId = req.params.surveyId
  Survey.findById(surveyId)
    .populate({
      path: 'questions',
      populate: {
        path: 'options'
      }
    })
    .exec()
    .then(docs => {
      res.status(200).send({
        Survey: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.update = (req, res) => {
  const surveyId = req.params.surveyId
  let survey = req.body
  Survey.updateOne({ _id: surveyId }, { $set: survey })
    .exec()
    .then(docs => {
      res.status(200).send({
        message: surveyMessage.update,
        Survey: survey
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.delete = async (req, res) => {
  const surveyId = req.params.surveyId
  let answers = await Answer.where('survey', surveyId).count()
  if (answers > 0) {
    res.status(409).send({
      message: 'Este formulário já foi iniciado e não pode ser deletado!',
      answers: answers
    })
  }else{
    let surveyResult = await Survey.findById(surveyId)
      .populate({
        path: 'questions',
        populate: {
          path: 'options'
        }
      })
      .exec()
    const survey = surveyResult.toObject()
    let questions = []
    let options = []
    survey.questions.forEach(question => {
      questions.push(question._id.toString())
      question.options.forEach(option => {
        options.push(option._id.toString())
      })
    })
    let promises = []
    if (questions.length > 0) promises.push(Question.deleteMany({ _id: {$in : questions} }).exec())
    if (options.length > 0) promises.push(Option.deleteMany({ _id: {$in : options} }).exec())
    promises.push(Survey.deleteMany({ _id: {$in : surveyId} }).exec())
    Promise.all(promises).then(result => {
      res.status(200).send('Formulário removido com sucesso!')
    }).catch(err => {
      res.status(500).send(err)
    })
  }
}