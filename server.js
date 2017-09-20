//server.js
var path = require('path');
var express = require('express');
var app = express();
var port = process.env.PORT || 8080; //process.env.PORT means that Heroku can set the port dynamically 

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require("connect-flash");

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser'); 
var session      = require('express-session');

//configuration ------------------------------------------------
var configDB = require('./config/database.js');

mongoose.connection.openUri(configDB.url); //Connect to the database

require("./config/passport")(passport); //pass passport to the configuration

//setup express
app.use(morgan('dev')); //Log requests to the console
app.use(bodyParser()); //For parsing html forms
app.use(cookieParser()); //Needed for auth
app.use(express.static(path.join(__dirname, 'public'))); //set the folder for images and css and stuff

//Setup View Engine
app.set('view engine', 'ejs');

//for passport
app.use( session({ secret: 'iloveellyforeverandalways' }) ); //session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); //Use flash for messages stored in session

//routes ----------------------------------------------
require("./app/routes.js")(app, passport);

//execute ---------------------------------------------
app.listen(port);
console.log("Server started listening on port " + port);

