const express = require("express");
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http);


const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const passportLocal = require('./config/passportConfig')
const passportGoogle = require('./config/passportGoogle')(passport)
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const methodOverride = require('method-override');
const User = require("./models/user.model");
require("dotenv").config();




/*
* Connect to MongoDB
*/
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODBURL, {
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
app.use('/tag', require('./routes/tag.route'))
app.use('/message', require('./routes/message.route'))


io.on('connection', (socket) =>  {
  //listen for new user
  socket.on('set user', async (data) => {
    try {
      let userFound = await User.find({username: {$regex: data}})
      if(!userFound){
          alert('no such user')
      } else {
          //set up a new variable username; socket is an object so u can add to it
        socket.username = data;
      }
    }
    catch (err) { console.log(err)}
  })
  //u have to emit msg to send message back and forth; only seen by connected users
  socket.emit('testmessage', 'Socket poppet');


  //will be sent to everyone but the sender
  socket.broadcast.emit('testmessage', 'someone new just joined the class')

  //listening for message from front end
  socket.on('sendmessage', message => {
    console.log('serverside sendmessage', socket.username)
      io.emit('chatmessage', {user: socket.username , message: message})
  })

  socket.on('typing', message => {
      socket.broadcast.emit('telling typing', {user: socket.username, message})
  });

  socket.on('disconnect', () => {
      //to everyone including me
      io.emit('testmessage', 'quiet has left the room')
  })
});

http.listen(process.env.PORT, () => console.log(`running express app ${process.env.PORT}`))

// app.listen(process.env.PORT, () =>
//   console.log(`connected to express on ${process.env.PORT}`)
// );