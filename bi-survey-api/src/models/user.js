const mongoose = require('mongoose')

// TODO: Fix email error
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idOauth: { type:Number, required: false, unique: true },
  name: { type:String, required: true },
  cpf: { type:String, required: false, unique: true },
  email: { type:String, required: true, unique: true },
  password: { type:String, required: true },
  userRole: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserRole', required: true}],
  status: { type:Boolean, default: true },
  registerDate: { type: Date, default: Date.now },
  profilePicture: String,
  contact: String,
  obs: String
})

module.exports = mongoose.model('User', userSchema)