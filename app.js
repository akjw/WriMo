const express = require("express");
const app = express();
// app.io = require('socket.io')();

// var app = require('express')();
// var server = require('http').Server(app);
// var io = require('socket.io')(server);

// var http = require('http')
// var server = http.createServer(app);
// app.io.attach(server);
/**
 * Listen on provided port, on all network interfaces.
 */

// server.listen(process.env.PORT);
// server.on('error', onError);
// server.on('listening', onListening);

const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const passportLocal = require('./config/passportConfig')
const passportGoogle = require('./config/passportGoogle')(passport)
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const methodOverride = require('method-override')
require("dotenv").config();




/*
Connect to MongoDB
*/
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODBLIVE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
.then(() => {
  console.log("mongodb is running!");
})
.catch((e) => {
  console.log(e);
});


/* Middleware */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })) 
app.set('view engine', 'ejs'); 
app.use(expressLayouts);
app.use(methodOverride('_method'))


app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ url: process.env.MONGODBLIVE }),
  })
);

// Passport init
app.use(passportLocal.initialize());
app.use(passportLocal.session());
app.use(flash());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  res.locals.searchTerm = req.query.search;
  next();
});



app.use('/', require('./routes/home.route'))
app.use('/search', require('./routes/search.route'))
app.use('/user', require('./routes/user.route'))
app.use('/auth', require('./routes/auth.route'))
app.use('/work', require('./routes/work.route'))
app.use('/prompt', require('./routes/prompt.route'))
app.use('/comment', require('./routes/comment.route'))
// app.use('/message', require('./routes/message.route')(app, io))




app.listen(process.env.PORT, () =>
  console.log(`connected to express on ${process.env.PORT}`)
);