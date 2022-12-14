const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const mainPowaiHome = require('./routes/admin/mainpowai/index');
const dashboard = require('./routes/api/dashboard/index');
const employee = require('./routes/api/employee/index');
const GetAllUser = require('./routes/admin/user/index');
const {initializingPassport }=require('./handlers/passport.js');


const accountApi = require('./routes/admin/account/index');

const errorHandlers = require('./handlers/errorHandlers');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({
  limit: '200mb'
}));
app.use(bodyParser.urlencoded({
  limit: '200mb',
  extended: true,
  parameterLimit: 100000
}));

app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

// Passport configuration
initializingPassport(passport);

// Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

app.use((req, res, next) => {
  res.locals.session = req.session;
//   res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// handle our api routes!
 
app.use('/account/dashboard', dashboard);
app.use('/admin', GetAllUser);
app.use('/account', accountApi);
app.use('/', accountApi);
app.use('/employee', employee);

// handle our admin routes!
// app.use('/admin/event', adminEventRoutes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect!
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}
// production error handler
// app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
