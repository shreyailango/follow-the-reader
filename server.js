const express = require('express'); // server software
const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login');// authorization
const request = require('request');
const User = require('./model/user.js'); // User Model
const url = require('url');
const querystring = require('querystring');
const { render } = require('ejs');
const app = express();
const router = express.Router();
const fs = require ("fs");
var bcrypt = require('bcryptjs');

app.use("/public", express.static("public"));
app.set("view engine", "ejs");
//const InitiateMongoServer = require("./config/db");

//InitiateMongoServer();

var bookData = null;

const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));


const apiKey = `${process.env.AIzaSyA3oELpN3ir6hNDiDjV5_hfV733hlJuFaI}`;

// Configure Sessions Middleware
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
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

// Route to Login Page
app.get('/login', (req, res) => {
  //res.sendFile(__dirname + '/views/login.html');
  res.render("login");
});

// Route to Dashboard
app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.send(`Hello ${req.user.username}. 
  <a href="/logout">Log Out</a><br><br><a href="/secret">Members Only</a>`);
});

// Route to Secret Page
app.get('/secret', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile(__dirname + '/views/secret-page.html');
});

// Route to Log out
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

// Post Route: /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Validate user input
  if (!(username && password)) {
    res.status(400).send("All input is required");
  }
  // Validate if user exist in our database
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {

    // user
    return res.status(200).json(user);
  }
  return res.status(400).send("Invalid Credentials");
  //return res.redirect('/profile');
  
// Our login logic ends here
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {

  // Our register logic starts here
   try {
    // Get user input
    const { name, username, email, password } = req.body;

    // Validate user input
    if (!(email && password && name && username)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedUserPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name: name,
      email: email.toLowerCase(), // sanitize
      password: encryptedUserPassword,
    });

    // Create token
    /*const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "5h",
      }
    );
    // save user token
    user.token = token; */

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});


app.get("/profile", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    //res.send(`Hello ${req.user.username}`);
    var username = req.user.username;
    //res.sendFile(__dirname + '/views/profile.html', options);
    res.render("profile", {username : username});
});

app.get("/my-profile", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  var user = req.user;
  res.render("my_profile", {user: user});
});

app.get("/search", (req, res) => {
    //res.sendFile(__dirname + '/views/author.html');
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
    .then(book => {res.render("search", {book:book}); book_data = JSON.stringify(book), bookData = book, fs.writeFileSync("book.json", book_data)})
    .catch(err => console.error("error: " + err));
  }, 
  ); 

  //fs.writeFileSync("book.json", book); 
app.get("/book", (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  return res.render("book", {url : fullUrl, book: bookData});
});

app.get("/review", (req, res) => {
  res.render("review");
});

// assign port
const port = 3000;
app.listen(port, () => console.log(`This app is listening on port ${port}`));