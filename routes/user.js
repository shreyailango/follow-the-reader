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

router.get("register", (req, res) => {

});

router.get("login", (req, res) => {

});


