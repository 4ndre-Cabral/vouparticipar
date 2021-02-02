const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const JwtDecoder =  require('jwt-decode')
const User = require('../models/user')
require('../store/messages')

// const { google } = require('googleapis')
// const oauth2Client = new google.auth.OAuth2(
//   '71004896026-6b080upitm6jer45lkhes2j07u5lenrf.apps.googleusercontent.com',
//   'YT5Kr8WmF62z_u7dJ_UY0aGm',
//   'http://localhost:3000'
// )
const {OAuth2Client} = require('google-auth-library')
const oAuth2Client = new OAuth2Client('71004896026-6b080upitm6jer45lkhes2j07u5lenrf.apps.googleusercontent.com')

exports.login = async (req, res) => {
  User.findOne({ email: req.body.email })
    .populate({
      path: 'userRole'
    })
    .exec()
    .then(docs => {
      try {
        if (docs) {
          bcrypt.compare(req.body.password, docs.password, (err, result) => {
            if (result) {
              loginResponse(res, docs)
            } else {
              return res.status(401).json({
                auth: false,
                token: null,
                message: userMessage.invalidPassword
              })
            }
          })
        } else {
          return res.status(500).send({
            auth: false,
            token: null,
            message: userMessage.notFound
          })
        }
      } catch (error) {
        console.log(error)
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.loginGoogle = async (req, res) => {
  const token = req.body.accessToken
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_OAUTH_CLIENTE_ID,
  })
  const payload = ticket.getPayload()
  const userid = parseInt(payload['sub'])
  User.findOne({ idOauth: userid })
    .populate({
      path: 'userRole'
    })
    .exec()
    .then(docs => {
      try {
        if (docs) {
          loginResponse(res, docs)
        } else {
          bcrypt.hash('123@vouparticipar', 10, async (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              })
            } else {
              // MongoDb
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                idOauth: userid,
                name: payload['name'],
                login: payload['email'],
                email: payload['email'],
                cpf: userid, // fix erro cpf null
                profilePicture: payload['picture'],
                password: hash,
                userRole: []
              })
              user.userRole.push('6000c3c7f9f569495410ae35')
              user.save().then(result => {
                User.findOne({ idOauth: userid })
                  .populate({
                    path: 'userRole'
                  })
                  .exec()
                  .then(docs => {
                    loginResponse(res, docs)
                  })
              }).catch(err => {
                res.status(500).send(err)
              })
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

const loginResponse = function (res, user) {
  const userData = user
  var token = jwt.sign({ userData }, process.env.SECRET, {
    expiresIn: '1h' // expires in 1h
  })
  return res.status(200).json({
    auth: true,
    token: token,
    message: userMessage.autorized,
    user: userData
  })
}

exports.refresh = (req, res) => {
  const loginToken = req.headers.authorization.split(' ')[1]
  if (loginToken !== null && loginToken !== undefined) {
    const jwtD = JwtDecoder(loginToken)
    const user = jwtD.user
    var token = jwt.sign({ user }, process.env.SECRET, {
      expiresIn: '1h' // expires in 1h
    })
    res.setHeader('Authorization', token)
  }
  res.status(200).send({
    message: 'Autorizado com sucesso'
  })
}