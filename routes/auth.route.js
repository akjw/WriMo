const router = require("express").Router();
const User = require('../models/user.model');
const passportLocal = require("../config/passportConfig");
const passport = require('passport');


// Registration
router.get('/register', (req, res) => {
  res.render('auth/register')
})

router.post('/register', async (req, res) => {
  try {
      let { name, email, username, password } = req.body;
      //since password is not a required field to account for those using googleAuth, compensate by ensuring password field is not empty
      if (password == ''){
          req.flash('error', 'Please enter password');
          return res.redirect('/auth/register');
      } else if (email == ''){
          req.flash('error', 'Please enter email address');
          return res.redirect('/auth/register');
      } else{
          let user = new User({ name, email, username, password})
          let savedUser = await user.save()
          if(savedUser){
            res.redirect('/auth/login')
          } 
      }
  } catch (err){
      if(err.errors.username.properties.message === 'Not Unique') { 
        req.flash('error', 'Username already exists.');
        return res.redirect('/auth/register');
      }
      console.log(err)
  }
})

//Login 
router.get('/login', (req, res) => {
  res.render('auth/login')
})


router.post(
  "/login",
  passportLocal.authenticate("local", {
    successRedirect: "/user/dashboard", 
    failureRedirect: "/auth/login", 
    failureFlash: "Invalid Username or password",
    successFlash: "Successfully logged in!"
  })
);

//Google authentication
router.get('/google', passport.authenticate('google', { scope: ['profile']}))

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login'}), 
    (req, res) => {
      res.redirect('/user/dashboard')
  })

//Logout 
router.get("/logout", (request, response) => {
  request.logout(); 
  request.flash("success", "Logged out");
  response.redirect("/auth/login");
});

module.exports = router;