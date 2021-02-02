const mongoose = require('mongoose')

const geometrySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  registerDate: { type: Date, default: Date.now },
  wkt: { type: String, required: true }
})

module.exports = mongoose.model('Geometry', geometrySchema)