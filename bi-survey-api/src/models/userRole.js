const mongoose = require('mongoose')

const userRoleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  description: { type:String, required: true, unique: true },
  create: {
    type: [String],
    require: false,
    enum: ['user', 'survey', 'question', 'option']
  },
  read: {
    type: [String],
    require: false,
    enum: ['user', 'survey', 'all_results', 'own_results']
  },
  update: {
    type: [String],
    require: false,
    enum: ['user', 'survey', 'question', 'option']
  },
  delete: {
    type: [String],
    require: false,
    enum: []
  }
})

module.exports = mongoose.model('UserRole', userRoleSchema)