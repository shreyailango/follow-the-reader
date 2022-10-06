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

const BookReviews = new Schema({
  title: String,
  subtitle: String,
  author: String,
  genre: String,
  description: String,
  review: String
});
// Export Model
BookReviews.plugin(passportLocalMongoose);

module.exports = mongoose.model('bookReviews', BookReviews, 'bookReviews');