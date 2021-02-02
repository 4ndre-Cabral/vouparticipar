if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const 
  express = require('express'),
  // bodyParser = require('body-parser'),

  auth = require('./router/authRouter'),
  userRouter = require('./router/userRouter'),
  userRoleRouter = require('./router/userRoleRouter'),
  surveyRouter = require('./router/surveyRouter'),
  optionRouter = require('./router/optionRouter'),
  optionGroupRouter = require('./router/optionGroupRouter'),
  geometryRouter = require('./router/geometryRouter'),
  questionRouter = require('./router/questionRouter'),
  answerRouter = require('./router/answerRouter'),

  checkAuth = require('./middleware/check-auth'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  multer = require('multer'),
  helpers = require('./util/googleCloudStore'),
  path = require('path'),
  fs = require('fs')

// Express config
const app = express()
const port = process.env.PORT || 3000
const folder = path.join(__dirname, 'files')

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder)
}

// CORS control
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, userId"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "Authorization, Content-Disposition"
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

// Show logger
app.use(morgan('dev'))

// Body format
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data

// Authentication middleware
// app.use(checkAuth)

// Routes which should handle requests
app.use('/auth', auth)
app.use('/users', userRouter)
app.use('/usersRole', checkAuth, userRoleRouter)
app.use('/surveys', surveyRouter)
app.use('/options', optionRouter)
app.use('/optionGroups', optionGroupRouter)
app.use('/geometries', geometryRouter)
app.use('/questions', questionRouter)
app.use('/answers', answerRouter)

// Connect to mongoose
mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.MONGO_ATLAS_URI : process.env.MONGO_ATLAS_DEV_URI, {
// mongoose.connect(process.env.MONGO_ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Set upload files settings
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})
app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.post('/upload/:fileName?', async (req, res, next) => {
  if (!req.file) {
    return next()
  }
  const file = req.file
  const fileName = req.params.fileName
  const imageUrl = await helpers.uploadImage(file, fileName)
  res.status(200).json({
    message: 'upload was successful',
    url: imageUrl
  })
})
app.post('/delete/:fileName', async (req, res, next) => {
  try {
    const fileName = req.params.fileName
    const imageUrl = await helpers.deleteImage(fileName)
    res.status(200).json({
      message: 'upload was successful',
      url: imageUrl
    })
  } catch (error) {
    next(error)
  }
})

// Handling errors
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})
app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

app.listen(port, () => {
  console.log(`Server is open on port ${port}`)
})