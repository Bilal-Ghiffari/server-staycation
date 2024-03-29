var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
// import monggose
const mongoos = require('mongoose')
mongoos.connect('mongodb+srv://codeathome:Ghiffari_Al10@cluster0.3cqax.mongodb.net/db_staycation?retryWrites=true&w=majority')

// import method-override 
const methodOverride = require('method-override')

// alert status and message
const session = require('express-session')
const flash = require('connect-flash')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// admin router
const adminRouter = require('./routes/admin');
// router api
const apiRouter = require('./routes/api'); 

var app = express();
// cors
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// method-override menggukan put dan delete
app.use(methodOverride('_method'))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))
app.use(flash())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/sb-admin-2', express.static(path.join(__dirname, '/node_modules/startbootstrap-sb-admin-2')))

app.use('/', indexRouter);
app.use('/users', usersRouter);
// admin
app.use('/admin', adminRouter);
// api
app.use('/api/v1/member', apiRouter);

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
