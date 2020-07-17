const router = require("express").Router();
const User = require('../models/user.model');
const passport = require("../config/passportConfig");


// Registration
router.get('/register', (req, res) => {
  res.render('auth/register')
})

router.post('/register', async (req, res) => {
  try {
      let { name, email, username, password } = req.body;
      let user = new User({ name, email, username, password})
      let savedUser = await user.save()
      console.log(user)
      if(savedUser){
          res.redirect('/auth/login')
      }
  } catch (err){
      console.log(err)
  }
})

//Login 
router.get('/login', (req, res) => {
  res.render('auth/login')
})


router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/prompt", 
    failureRedirect: "/auth/login", 
    failureFlash: "Invalid Username or password",
    successFlash: "Successfully logged in!"
  })
);

//Logout 
router.get("/logout", (request, response) => {
  request.logout(); 
  request.flash("success", "Logged out");
  response.redirect("/auth/login");
});

module.exports = router;