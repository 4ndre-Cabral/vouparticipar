const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  prerender = require('prerender-node'),
  port = process.env.PORT || 5000

const app = express()
const prerenderToken = process.env.PRERENDER_TOKEN

app.use(history())
app.use(serveStatic(`${__dirname}/dist/spa`))
app.use(prerender.set('prerenderToken', prerenderToken))
app.listen(port)
