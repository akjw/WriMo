const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.model");

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) return done(err);

        // If no user is found 
        if (!user) return done(null, false, { message: 'Invalid username/password' });

        // If password is incorrect
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Invalid username/password' })};

        return done(null, user);
      });
    }
  )
);

module.exports = passport;