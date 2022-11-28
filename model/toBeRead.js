// dependencies
const mongoose = require('mongoose');
const BSON = require("bson");
const passportLocalMongoose = require('passport-local-mongoose');
// connect to database
mongoose.connect('',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Create Model
const Schema = mongoose.Schema;

const toBeRead = new Schema({
  bookID: String,
  addedBy: {
    type: mongoose.Schema.Types.String,
    ref: "User"
  }
});
// Export Model
toBeRead.plugin(passportLocalMongoose);

module.exports = mongoose.model('toBeRead', toBeRead);
