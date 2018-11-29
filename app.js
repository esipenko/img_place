const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const getIdRouter = require('./routes/getId');
const session = require('express-session');

require('./config/passport')(passport);


const app = express();


mongoose.connect('mongodb+srv://dbEsipenko:dbEsipenko@img-9i8cu.gcp.mongodb.net/test?retryWrites=true', {
  useNewUrlParser: true
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(flash());
app.use(bodyParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use('/users', express.static(path.join(__dirname, '/users')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'asdfmaljfklasjdflkcajsf',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/', indexRouter);
app.use('/getId', getIdRouter);
app.use('/users/', usersRouter);




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
