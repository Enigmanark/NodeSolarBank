// ./app/routes.js
var config = require("../config/config.js");
var accountManager = require('./accountManager.js');
var signUp = require("./signUp");
var title = config.titleOfApp + " " + config.version;

module.exports = function(app, passport) {
//----------------------------------------------
    //Home Page --------------------------------
//----------------------------------------------
    app.get("/", function(req, res) {
        res.render('index.ejs', { 
            title: title, 
            loggedIn: req.isAuthenticated(), //always pass whether logged in, the navbar needs it
            user : req.user //always pass user, the navbar needs it, ejs handles if user is null or not
        });
    });
//----------------------------------------------
    //Contact --------------------------------
//----------------------------------------------
    app.get("/contact", function(req, res) {
        res.render('contact.ejs', { 
            title: title, 
            loggedIn: req.isAuthenticated(),//always pass whether logged in, the navbar needs it
            user : req.user //always pass user, the navbar needs it, ejs handles if user is null or not
        });
    });
//----------------------------------------------
    //About --------------------------------
//----------------------------------------------
    app.get("/about", function(req, res) {
        res.render('about.ejs', { 
            title: title, 
            loggedIn: req.isAuthenticated(),//always pass whether logged in, the navbar needs it
            user : req.user //always pass user, the navbar needs it, ejs handles if user is null or not
        });
    });

//-------------------------------------------
    //Login -------------------------------------
//-------------------------------------------
    app.get('/login', function(req, res) {
        //If we just registered show a message that it was successful
        if(req.query.registered) {
            req.flash("registerSuccess", "Registration successful. You may now login.");
            res.render('login.ejs', {
                title: title,
                successfulRegister: req.flash("registerSuccess"), 
                message: req.flash('loginMessage')
            });
        }
        else {
            //render the page and pass any flash data if it exists
            res.render('login.ejs', { 
                title: title,
                successfulRegister: "none", 
                message: req.flash('loginMessage')
            } );
        }
    });

    //process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/account', //Forward to profile page after login
        failureRedirect: '/login', //Redirect to try to login again
        failureFlash: true //allow sending error messages
    }))
//-----------------------------------------------
    //Sign up -----------------------------------
//-----------------------------------------------
    app.get('/signup', function(req, res) {
        //If there was a signup error
        if(req.query.error) {
            req.flash("signUpError", "There is already an account with that email.");
            res.render('signup.ejs', {
                title: title,
                message: req.flash("signUpError"),
            });
        }
        else {
            //else just display normal signup if there's no error
            res.render('signup.ejs', { 
                title: title, 
                message: "none"
            } );
        }
    });

    //process the signup form
    app.post('/signup', signUp, function(req, res) {
        res.redirect("/login?registered=true");
    });
//----------------------------------------------
    //Account ----------------------------------
//----------------------------------------------
    //This will be protected so you have to be logged in to visit these urls, we will use the isLoggedIn() function
    app.get('/account', isLoggedIn, function(req, res) {
        res.render('account.ejs', {
            title: title,
            loggedIn: req.isAuthenticated(),//always pass whether logged in, the navbar needs it
            user : req.user //get the user from session and pass to template
        });
    });

    //Send form for deposit, but first check if the user is logged in or not
    app.get('/account/deposit', isLoggedIn, function(req, res) {
        res.render('deposit.ejs', {
            title: title,
            loggedIn: req.isAuthenticated(),//always pass whether logged in, the navbar needs it
            user: req.user,
            message: "none"
        });
    });

    //Handle processing for deposit
    app.post('/account/deposit', isLoggedIn, accountManager.deposit, function(req, res) {
        req.flash("DepositSuccess", "Your deposit was successful.");
        res.render('deposit.ejs', { 
            title: title , 
            loggedIn: req.isAuthenticated(),//always pass whether logged in, the navbar needs it
            user: req.user,
            message: req.flash('DepositSuccess')
        });
    })

     //Handle processing for withdrawal, first check if user is logged in, then process the withdrawal through
     //account manager
    app.post('/account/withdraw', isLoggedIn, accountManager.withdraw, function(req, res) {
        //if the program makes it here then something went badly wrong
        req.flash("WithdrawServerError", "Critical error with withdraw. Contact admin.");
        res.redirect('error.ejs', {
            errorMessage: req.flash("WithdrawServerError")
        });
    });

    //Send form for withdrawal, but first check if the user is logged in or not
    app.get('/account/withdraw', isLoggedIn, function(req, res) {
        if(req.query.error) {
            req.flash("WithdrawError", "You don't have enough money for that withdrawal.");
            res.render('withdraw.ejs', {
                title: title,
                loggedIn: req.isAuthenticated(),//always pass whether logged in, the navbar needs it
                user: req.user,
                errorMessage: req.flash("WithdrawError"),
                message: "none"
            });
        } 
        else if(req.query.success) {
            req.flash("WithdrawSuccess", "Your withdrawal was successful.");
            res.render('withdraw.ejs', { 
                title: title , 
                loggedIn: req.isAuthenticated(),//always pass whether logged in, the navbar needs it
                user: req.user,
                errorMessage: "none",
                message: req.flash('WithdrawSuccess')
            });
        }
        else {
            res.render('withdraw.ejs', {
                title: title,
                loggedIn: req.isAuthenticated(),//always pass whether logged in, the navbar needs it
                user: req.user,
                message: "none",
                errorMessage: "none"
            });
        }
    });
//----------------------------------------------
    //Logout -----------------------------------
//----------------------------------------------
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    })


//----------------------------------------------
    //404 Error --------------------------------
//----------------------------------------------
    app.use(function (req, res, next) {
        res.status(404).send("Sorry can't find that!")
      })
}

//----------------------------------------------
//IsLoggedIn()
function isLoggedIn(req, res, next) {
    //if the user is authenticated then carry on 
    if(req.isAuthenticated()) {
        console.log("Is authenticated");
        return next();
    }

    //Otherwise redirect to login
    console.log("Not authenticated, redirecting");
    res.redirect('/login');
}
