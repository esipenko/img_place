const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  username: String
});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app

module.exports = mongoose.model('User', UserSchema);
