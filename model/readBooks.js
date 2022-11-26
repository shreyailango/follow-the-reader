// dependencies
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// connect to database
mongoose.connect('mongodb+srv://silango:0xs2dS6FaQoq5ndS@cluster0.h9g9gjy.mongodb.net/test',{
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