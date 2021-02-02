var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API: '"http://localhost:3000"',
  // API: '"https://bi-survey-api.herokuapp.com"',
  GOOGLE_KEY: '""',
  GOOGLE_OAUTH_ID: '""',
  SIMPLE_CRYPTO_KEY: '""',
  // TRACKING_URL: '"https://tracking.vouparticipar.com"'
  TRACKING_URL: '"https://r-formulario.herokuapp.com"'
})
