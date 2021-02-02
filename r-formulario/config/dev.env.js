var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API: 'http://localhost:3000',
  API: 'https://bi-survey-api.herokuapp.com',
  SIMPLE_CRYPTO_KEY: ''
})
