const express = require("express");
const app = express();
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
mongoose.connect(process.env.MONGODBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
},
  () => {
      console.log('MongoDB connected!')
  }
);

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
    store: new MongoStore({ url: process.env.MONGODBURL }),
  })
);

// Passport init
app.use(passportLocal.initialize());
app.use(passportLocal.session());
app.use(flash());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.use('/', require('./routes/home.route'))
app.use('/search', require('./routes/search.route'))
app.use('/user', require('./routes/user.route'))
app.use('/auth', require('./routes/auth.route'))
app.use('/work', require('./routes/work.route'))
app.use('/prompt', require('./routes/prompt.route'))
app.use('/comment', require('./routes/comment.route'))




app.listen(process.env.PORT, () =>
  console.log(`connected to express on ${process.env.PORT}`)
);