// dependencies
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// connect to database
mongoose.connect('',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Create Model
const Schema = mongoose.Schema;

const ReadBooks = new Schema({
  title: String,
  subtitle: String,
  author: String,
  genre: String,
  readBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});
// Export Model
ReadBooks.plugin(passportLocalMongoose);

module.exports = mongoose.model('readBooks', ReadBooks, 'readBooks');
