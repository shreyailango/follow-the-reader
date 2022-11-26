// dependencies
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const BSON = require("bson");
// connect to database
mongoose.connect('mongodb+srv://silango:0xs2dS6FaQoq5ndS@cluster0.h9g9gjy.mongodb.net/test',{
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