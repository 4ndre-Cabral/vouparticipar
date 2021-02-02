const mongoose = require('mongoose')

const optionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  label: { type: String, required: true },
  registerDate: { type: Date, default: Date.now },
  photoUrl: String
})

module.exports = mongoose.model('Option', optionSchema)