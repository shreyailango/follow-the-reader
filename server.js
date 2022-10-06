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

app.use("/public", express.static("public"));
app.set("view engine", "ejs");

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
app.post('/login', passport.authenticate('local', { failureRedirect: '/' }),  function(req, res) {
	//console.log(req.user);
    //res.send(`Hello ${req.user.username}`);
	return res.redirect('/profile');
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
});

app.get("/profile", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    //res.send(`Hello ${req.user.username}`);
    var options = {
        username: req.user.username
    };
    //res.sendFile(__dirname + '/views/profile.html', options);
    res.render("profile");
});

app.get("/author", async (req, res) => {
    //res.sendFile(__dirname + '/views/author.html');
    res.render("author", {book:null});
});

app.get("/author/:searchTerm", (req, res) => { 
    let searchTerm = req.body.searchTerm;
    console.log("author = " + searchTerm);
    res.send(req.params.searchTerm);
});

/*app.post("/author/:id", async (req, res) => { 
    let searchTerm = req.body.searchTerm;
    console.log("author = " + searchTerm);
    //let url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${searchAuthor}`;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`;
    request(url, function(err, res, body) {
  
      // On return, check the json data fetched
      if (err) {
          res.render('author', { book: null, error: 'Error, please try again' });
      } else {
          let book = JSON.parse(body);
          //console.log(book["items"]);
          for (let i = 0; i < book["items"].length; i++) {
            console.log(book["items"][i]["volumeInfo"]["title"]);
            console.log(book["items"][i]["volumeInfo"]["subtitle"]);
            console.log(book["items"][i]["volumeInfo"]["authors"]);
            console.log(book["items"][i]["volumeInfo"]["description"]);
            console.log(book["items"][i]["volumeInfo"]["categories"]);
          }
    }

    });
  }); */

app.post("/author/:searchTerm", (req, res) => {
  let searchTerm = req.body.searchTerm;
  console.log("author = " + searchTerm);
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`, 
  { method: "GET", 
	headers: {'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then(book => {res.render("author", {book:book});})
    .catch(err => console.error("error: " + err));
    
  }, 
  ); 
  
// assign port
const port = 3000;
app.listen(port, () => console.log(`This app is listening on port ${port}`));