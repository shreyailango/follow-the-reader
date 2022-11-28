// dependencies
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const BSON = require("bson");
// connect to database
mongoose.connect('',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Create Model
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  toBeRead: [String],
  markAsRead: [String]
});
// Export Model
User.plugin(passportLocalMongoose);
 
module.exports = mongoose.model("User", User);
