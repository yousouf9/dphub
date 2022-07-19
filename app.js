const createError = require('http-errors');
                    require('express-async-errors');
const winston   = require('winston');
                  require('winston-mongodb');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Joi = require('joi');
       Joi.objectId = require('joi-objectid')(Joi); 
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const config = require('config')
const _ = require('lodash');
const {countDown} = require('./utility/counter');
const compression = require('compression');


require('./startup/db');


const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const homeRouter = require('./routes/home/index');
const aboutRouter = require('./routes/about/index');
const getInvolvedRouter = require('./routes/getinvolved/index');
const whatwedoRouter = require('./routes/whatwedo/index');
const resourceRouter = require('./routes/resource/index');
const contactRouter = require('./routes/contact/index');
const donateRouter = require('./routes/donate/index');
const generalRouter = require('./routes/general/index');
const complaintRouter = require('./routes/complaint/index');
const app = express();

app.use(compression());

 


  process.on('uncaughtException', (ex)=>{
    console.log('A FATAL ERROR UNCAUGHTEXCEPTION', ex)
    winston.error(ex.message, ex)
    process.exit(1)
  })

  process.on('unhandledRejection',  (ex)=>{

  console.log('A FATAL ERROR UNHANDLEEXCEPTION')
  winston.error(ex.message, ex)
  process.exit(1)

  })


  winston.add(new winston.transports.File({filename: 'logfile.log'}));
  winston.add(new winston.transports.MongoDB({db: config.get('hostname')}));

  //checking for Jsonwebtoken key
  if(!config.get("jwtPrivate")){
    serverDebug('A FATAL ERROR jwtPrivate is requires', config.get('jwtPrivate'));
    process.exit(1);
  }

app.locals.moment = require('moment');

app.locals.truncateText = function(text, length){
  return text.substr(0, length);
};

app.locals.isObjectEmpty = function(data) {
   return _.isEmpty(data)
}
app.locals.dateCounter = function(date) {

      console.log(date);
    return countDown(date);
}

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
  resave: true,
  cookie:{maxAge:60000}
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
app.use('/', whatwedoRouter);
app.use('/', generalRouter);
app.use('/', contactRouter);
app.use('/', donateRouter);
app.use('/', resourceRouter)
app.use('/', complaintRouter);


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
