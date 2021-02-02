const mongoose = require('mongoose')

const questionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  description: { type:String, required: true },
  active: { type: Boolean, default: true},
  registerDate: { type: Date, default: Date.now },
  type: {
    type: String,
    require: true,
    enum: ['single_option', 'multiple_option']
  },
  lastQuestionId: mongoose.Schema.Types.ObjectId,
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option', required: false}]
})

module.exports = mongoose.model('Question', questionSchema)