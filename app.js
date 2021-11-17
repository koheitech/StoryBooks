'use strict';

const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');


// loading config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

connectDB();

const app = express();

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Logging with morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars Helpers
const { formatDate, truncate, stripTags, editIcon } = require('./helpers/hbs');

// Handlebars: template engine setting
app.engine(
  '.hbs', 
  exphbs.engine({ 
    helpers: {
      formatDate,
      truncate,
      stripTags,
      editIcon
    },
    defaultLayout: 'main', 
    extname: '.hbs' 
  }));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: "mongodb+srv://koheitech:koheitech@cluster0.us7lg.mongodb.net/storybooks?retryWrites=true&w=majority" })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`));