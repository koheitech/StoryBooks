'use strict';

const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
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

// Apply production middleware
require('./config/prod')(app);

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// Logging with morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars Helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs');

// Handlebars: template engine setting
app.engine(
  '.hbs', 
  exphbs.engine({ 
    helpers: {
      formatDate,
      truncate,
      stripTags,
      editIcon,
      select
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