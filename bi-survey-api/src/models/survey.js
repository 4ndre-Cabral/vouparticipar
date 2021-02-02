const mongoose = require('mongoose')

const surveySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  active: { type: Boolean, default: true },
  expirationDate: Date,
  registerDate: { type: Date, default: Date.now },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: false}],
  ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: String,
  description: String,
  geometries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Geometry', required: false}],
  photoUrl: String
})

module.exports = mongoose.model('Survey', surveySchema)