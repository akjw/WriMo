const express = require("express");
const app = express();
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const passport = require('./config/passportConfig')
const session = require("express-session");
const flash = require('connect-flash');
const methodOverride = require('method-override')
require("dotenv").config();

const User = require('./models/user.model');
const Prompt = require("./models/prompt.model");
const Work = require("./models/work.model");



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
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 360000 }
  })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.use( async (req,res, next) => {
  try {
    let allP = await Prompt.find().select('name');
    let allW = await Work.find().select('title');
    let allU = await User.find().select('username');
    res.locals.allPrompts = req.allP;
    res.locals.allWorks = req.allW;
    res.locals.allUsers = req.allU;
    next();
  }
  catch (err) { console.log(err)}
})

app.use('/search', require('./routes/search.route'))
app.use('/user', require('./routes/user.route'))
app.use('/auth', require('./routes/auth.route'))
app.use('/work', require('./routes/work.route'))
app.use('/prompt', require('./routes/prompt.route'))
app.use('/comment', require('./routes/comment.route'))


app.listen(process.env.PORT, () =>
  console.log(`connected to express on ${process.env.PORT}`)
);