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

const BookReviews = new Schema({
  bookID: String,
  rating: Number,
  review: String,
  postedBy: {type: mongoose.Schema.Types.String, ref: 'User'}
});

// Export Model
BookReviews.plugin(passportLocalMongoose);

module.exports = mongoose.model('bookReviews', BookReviews, 'bookReviews');
