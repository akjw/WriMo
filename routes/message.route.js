const router = require('express').Router();
const User = require('../models/user.model');
const Room = require('../models/room.model');


router.get('/', async (req, res) => {
  try {
    var searchUser = undefined
    var loggedUser = req.user
    var noResults = null;
    var users = null
    var status = false;
    var chats = await Room.find({ users: { $in: [loggedUser] } }).populate('users')
    res.render('messages/index', { searchUser, users, loggedUser, noResults, chats })
  }
  catch (err) {console.log(err)}
})

router.get('/find', async (req, res) => {
  try {
    //execute if a search query is made
    let loggedUser = req.user.id
    var searchUser = req.query.user;
    var noResults = null;
    if(req.query.user) {
      let users =  await User.find({username: { $regex: req.query.user, $options: 'i'}}, function(err, matchUsers){
        if(err){
            console.log(err);
        } else {
            if(matchUsers.length < 1) {
                console.log('no users matching')
            }
            console.log('all users', matchUsers)
        }
    })
       if(users.length < 1 ){
           noResults = "No matching results."
       }
        res.render("messages/index",{ searchUser, users, noResults, loggedUser });
    }
  }
  catch(err) {console.log(err)}
})

router.get('/chat/:userid/to/:partnerid', async (req, res) => {
  try {
    let loggedUsername = req.user.username;
    let partner = await User.findById(req.params.partnerid)
    let partnerUsername = partner.username
    res.render('messages/chat', {loggedUsername, partnerUsername})
  } 
  catch (err) {console.log(err)}
})

router.post('/chat/:userid/to/:partnerid', async (req, res) => {
  try {
    console.log('inside post')
    var loggedUser = req.user.id;
    var partner = req.params.partnerid;
    let roomExists = await Room.find({ users: { $all: [loggedUser, partner] } }).populate('users')
    console.log('Room exists', roomExists)
    if (roomExists) {
      res.redirect('/message')
    } else {
      let chatRoom = await Room.create({ users: [loggedUser, partner]});
      console.log("created chatRoom", chatRoom)
      res.render('messages/chat', { loggedUser, partner })
    }
  }
  catch (err) { console.log(err)}
})

module.exports = router