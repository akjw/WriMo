const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

var userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  prompts: [{
    type: Schema.Types.ObjectId,
    ref: "Prompt"
  }],
  works: [{
    type: Schema.Types.ObjectId,
    ref: "Work"
  }],
  faveWorks : [{
    type: Schema.Types.ObjectId,
    ref: "Work"
  }]
}, {timestamps: true});

userSchema.pre("save", function(next) {
  var user = this;
  if (!user.isModified("password")) return next();
  var hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  next();
});

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

//check for existing username
userSchema.plugin(uniqueValidator, { message: 'Not Unique' });


const User = mongoose.model("User", userSchema);
module.exports = User;