const mongoose = require('mongoose')

const optionGroupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  description: { type:String, required: true },
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option', required: false}],
  ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})

module.exports = mongoose.model('OptionGroup', optionGroupSchema)