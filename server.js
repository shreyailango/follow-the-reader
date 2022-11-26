const express = require('express'); // server software
const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login');// authorization
const request = require('request-promise');
const User = require('./model/user'); // User Model
const ReadBooks = require('./model/readBooks.js'); 
const toBeRead = require('./model/toBeRead.js'); 
const BookReview = require('./model/bookReviews.js'); // User Model
const url = require('url');
const querystring = require('querystring');
const { render } = require('ejs');
const app = express();
const router = express.Router();
const async = require("async");
var bcrypt = require('bcryptjs');
app.use("/public", express.static("public"));
app.set("view engine", "ejs");

// connect to db
const db = require('./db');
db.connect();
//const InitiateMongoServer = require("./config/db");

//InitiateMongoServer();

const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));


const apiKey = `${process.env.AIzaSyA3oELpN3ir6hNDiDjV5_hfV733hlJuFaI}`;

// Configure Sessions Middleware
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  //cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(User.createStrategy());

// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Route to Homepage
app.get('/', (req, res) => {
  res.render("index");
});

app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


app.get('/login', passport.authenticate('local', { failureRedirect: '/' }),  function(req, res) {
  const { username, password } = req.body;
  //console.log(username, password);
	res.redirect('/profile');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/' }),  function(req, res) {
	res.redirect('/profile');
});


app.get("/register", (req, res) => {
  res.render("register");
}); 

app.post("/register", (req, res) => {
  var user = req.body;
  //console.log(user);
  User.register({name: user.name, username: user.username, email: user.email, active: false}, user.password);
  res.redirect("/login");
});

/*
app.get("/profile", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  var user = req.user;
  const tbrShelf = [];
  const promises = req.user.toBeRead.map(url => request(`https://www.googleapis.com/books/v1/volumes/${url}`));
  loadTBRShelf(promises, tbrShelf);
  console.log("final array = ", tbrShelf);
  res.render("profile", {user : user, tbrShelf: tbrShelf})}
); 

*/

app.get("/profile", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  var user = req.user;
  const tbrShelf = await loadBookshelf(req.user.toBeRead);
  //const markAsRead = await loadBookshelf(req.user.markAsRead);
  //console.log(tbrShelf);
  //res.render("profile", {user : user, tbrShelf: tbrShelf, markAsRead: markAsRead});
  res.render("profile", {user : user, tbrShelf: tbrShelf});
});


async function loadBookshelf(bookArray) {
  let bookShelf = [];
  let promises = [];
  let result;
  for (let i = 0; i < bookArray.length; i++) {
    promises.push(makeAPICall(bookArray[i]));
  }
  result = await Promise.all(promises);
  for (let i = 0; i < bookArray.length; i++) {
    bookShelf.push(result[i]);
  }
  return bookShelf;
}

function makeAPICall(bookID){
  return request({
      url : `https://www.googleapis.com/books/v1/volumes/${bookID}`,
      method : 'GET',
      json : true
  })
}

app.get("/my-profile", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  var user = req.user;
  res.render("my_profile", {user: user});
});

app.get("/search", (req, res) => {
    let searchTerm = req?.query?.searchTerm;
    if (searchTerm === undefined) {
      res.render("search", {book:null});
    } else {
      console.log("author = " + searchTerm);
    }
});

app.post("/search/", (req, res) => {
  let searchTerm = req.body.searchTerm;
  console.log("author = " + searchTerm);
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`, 
  { method: "GET", 
	headers: {'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then(book => {res.render("search", {book:book});})
    .catch(err => console.error("error: " + err));
  }, 
  ); 

app.get("/book", (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  //console.log(fullUrl);
  var title = fullUrl.substring(34, url.length);
  let bookTitle = title.replace(/%20/g, " ");
  bookTitle = bookTitle.replace(/%27/g, `'`);
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookTitle}`, 
  { method: "GET", 
	headers: {'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then(book => {res.render("book", {book:book["items"][0], bookID: book["items"][0]["id"]})})
    .catch(err => console.error("error: " + err));
});

app.get("/review", (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var title = fullUrl.substring(34, url.length);
  let bookTitle = title.replace(/%20/g, " ");
  bookTitle = bookTitle.replace(/%27/g, `'`);
  //res.render("review", {url: fullUrl, book: bookData});
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookTitle}`, 
  { method: "GET", 
	headers: {'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then(book => {res.render("review", {book:book["items"][0], bookID: book["items"][0]["id"]}); console.log(book["items"][0])})
    .catch(err => console.error("error: " + err));
});

app.post("/review", async (req, res) => {
  const bookID = req.body.bookID;
  const review = req.body.review;
  const rating = req.body.rate;
  console.log(bookID);
  console.log(review);
  console.log(rating);

  /*const bookReview = await BookReview.create({
    title: String,
    subtitle: String,
    author: String,
    genre: String,
    description: String,
    rating: rating,
    review: review,
    postedBy: username
  }); */

});

app.post("/addToBookshelf", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  //console.log(fullUrl);
  const bookID = fullUrl.substring(44, url.length);
  //console.log(bookID);
  if (req.user.toBeRead.includes(bookID)) {
    console.log("book is already in your bookshelf");
    //console.log("book is already in your bookshelf");
  }
  else {
    const addBook = {
      $push: {
        toBeRead: bookID,
      },
    };
  
    const result = await User.findByIdAndUpdate({_id: req.user._id}, addBook);
  }
  res.redirect("/profile");
});


app.post("/markAsRead", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  //console.log(fullUrl);
  const bookID = fullUrl.substring(44, url.length);
  //console.log(bookID);
  const addBook = {
    $push: {
      markAsRead: bookID,
    },
  }; 

  const result = User.findByIdAndUpdate({_id: req.user._id}, addBook);
  console.log(result);
  res.redirect("/profile");
}); 

app.get("/changepassword", (req, res) => {
  res.render("forgot_password");
});

app.post('/changepassword', function (req, res) {
  User.findByUsername(req.body.username, (err, user) => {
      if (err) {
          res.send(err);
      } else {
          user.changePassword(req.body.oldpassword, 
          req.body.newpassword, function (err) {
              if (err) {
                  res.send(err);
              } else {
                  res.send('successfully change password')
              }
          });
      }
  });
});
// assign port
const port = 8080;
app.listen(port, () => console.log(`This app is listening on port ${port}`));