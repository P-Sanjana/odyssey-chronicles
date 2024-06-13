const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')

const connectDB = require('./config/db')

dotenv.config({ path: './config/config.env' })

require('./config/passport')(passport)

connectDB()

const app = express()

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.engine('.hbs', exphbs.engine({defayltLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))


const port = process.env.port;

app.listen(
  port,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
