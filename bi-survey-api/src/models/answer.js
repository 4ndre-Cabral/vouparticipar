const mongoose = require('mongoose')

const answerQuestionsSchema = mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true},
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option', required: true}]
})

const answerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  survey: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey'},
  date: { type: Date, default: Date.now },
  lat: mongoose.Schema.Types.Decimal128,
  lng: mongoose.Schema.Types.Decimal128,
  answerQuestions: [answerQuestionsSchema],
  userIp: { type: String, required: true },
  userId: { type: String, required: true }
})

module.exports = mongoose.model('Answer', answerSchema)