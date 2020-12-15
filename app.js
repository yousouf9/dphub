const createError = require('http-errors');
                    require('express-async-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Joi = require('joi');
       Joi.objectId = require('joi-objectid')(Joi); 
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

require('./startup/db');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const homeRouter = require('./routes/home/index');
const aboutRouter = require('./routes/about/index');
const getInvolvedRouter = require('./routes/getinvolved/index');
const generalRouter = require('./routes/general/index');


const app = express();
app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Handle express sessions
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());



app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//This routes makes user available in the pug template
app.get('*', (req, res, next)=>{
  res.locals.user =req.user || null
  next();
});

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/', homeRouter);
app.use('/', aboutRouter);
app.use('/', getInvolvedRouter);
app.use('/', generalRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
