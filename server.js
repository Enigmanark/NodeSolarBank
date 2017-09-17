//server.js
var titleOfApp = "Node.js Solar Bank";
var version = "0.1.0";
var title = titleOfApp + " " + version;

var path = require('path');
var express = require('express');
var app = express();
var port = process.env.port || 8080;

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require("connect-flash");

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser'); 
var session      = require('express-session');

//configuration ------------------------------------------------
var configDB = require('./config/database.js');

mongoose.connect(configDB.url); //Connect to the database

require("./config/passport")(passport); //pass passport to the configuration

//setup express
app.use(morgan('dev')); //Log requests to the console
app.use(bodyParser()); //For parsing html forms
app.use(cookieParser()); //Needed for auth

//Setup View Engine
app.set('view engine', 'ejs');

//for passport
app.use( session({ secret: 'iloveellyforeverandalways' }) ); //session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); //Use flash for messages stored in session

//routes ----------------------------------------------
require("./app/routes.js")(app, passport, title);

//execute ---------------------------------------------
app.listen(port);
console.log("Server started listening on port " + port);

