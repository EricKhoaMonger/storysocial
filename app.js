const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methorOverride = require('method-override')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')

// Load User Model
require('./models/User')
require('./models/Story')

// Passport config
require('./config/passport')(passport)

// Load Keys
const keys = require('./config/keys')

// Handlebars Helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helpers/hbs')

// Load Routes
const index = require('./routes/index')
const auth = require('./routes/auth')
const stories = require('./routes/stories')

// Map global Promise
mongoose.Promise = global.Promise
// Mongoose Connect
mongoose.connect(keys.mongoURI, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('MongoDB Connected');
    }).catch(err => console.log(err))

const app = express()

// Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers:{
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
    defaultLayout: 'main'
}))
app.set('view engine',  'handlebars')

// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// Method Override Middleware
app.use(methorOverride('_method'))

// Cookie Parser Middleware
app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Global Vars
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Use Routes
app.use('/', index)
app.use('/auth', auth)
app.use('/stories', stories)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})
