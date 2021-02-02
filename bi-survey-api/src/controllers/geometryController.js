const mongoose = require('mongoose')
const Geometry = require('../models/geometry')
const Survey = require('../models/survey')
const userController = require('../controllers/userController')
require('../store/messages')

exports.add = (req, res) => {
  let geometry = new Geometry(req.body)
  geometry._id = new mongoose.Types.ObjectId()
  geometry.save().then(result => {
    res.status(201).send(geometry)
  }).catch(err => {
    res.status(500).send(err)
  })
}

exports.getAll = async (req, res) => {
  const userId = req.get('userId')
  const filter = await userController.getFilterByUserId(userId)
  Geometry.find(filter)
    .select()
    .exec()
    .then(docs => {
      res.status(200).send({
        count: docs.length,
        geometries: docs
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.getbyId = (req, res) => {
  const geometryId = req.params.geometryId
  Geometry.findById(geometryId)
    .exec()
    .then(docs => {
      res.status(200).send(docs)
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.getAllById = (req, res) => {
  const geometryId = req.params.geometryId.split(',')
  Geometry.find({ '_id': geometryId })
    .exec()
    .then(docs => {
      res.status(200).send(docs)
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.update = (req, res) => {
  const geometryId = req.params.geometryId
  Geometry.updateOne({ _id: geometryId }, { $set: req.body })
    .exec()
    .then(docs => {
      res.status(200).send(docs)
    })
    .catch(err => {
      res.status(500).send(err)
    })
}

exports.delete = (req, res) => {
  const geometryId = req.params.geometryId
  Survey.find({ 'geometries': [geometryId] })
    .select()
    .exec()
    .then(docs => {
      if (docs.length > 0) {
        res.status(409).send({
          count: 'Esta região possui vínculo e não pode ser deletada!'
        })
      } else {
        Geometry.deleteMany({ _id: {$in : geometryId} })
        .exec()
        .then(docs => {
          res.status(200).send(docs)
        })
        .catch(err => {
          res.status(500).send(err)
        })
      }
    })
    .catch(err => {
      res.status(500).send(err)
    })
}