// ./app/routes.js

var accountManager = require('./accountManager.js');

module.exports = function(app, passport, title) {
//----------------------------------------------
    //Home Page --------------------------------
//----------------------------------------------
    app.get("/", function(req, res) {
        res.render('index.ejs', { title: title });
    });
    //-------------------------------------------
    //Login -------------------------------------
    //-------------------------------------------
    app.get('/login', function(req, res) {
        //render the page and pass any flash data if it exists
        res.render('login.ejs', { title: title, message: req.flash('loginMessage') } );
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
        //render the page and pass any flash data if it exists
        res.render('signup.ejs', { title: title, message: req.flash('signupMessage') } );
    });

    //process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', //redirect to profile page if successful
        failureRedirect: '/signup', //redirect to signup if fail
        failureFlash: true //allow flash messages
    }))
//----------------------------------------------
    //Account ----------------------------------
//----------------------------------------------
    //This will be protected so you have to be logged in to visit these urls, we will use the isLoggedIn() function
    app.get('/account', isLoggedIn, function(req, res) {
        res.render('account.ejs', {
            title: title,
            user : req.user //get the user from session and pass to template
        });
    });

    //Send form for deposit, but first check if the user is logged in or not
    app.get('/account/deposit', isLoggedIn, function(req, res) {
        res.render('deposit.ejs', {
            title: title,
            user: req.user,
            message: "none"
        });
    });

    app.post('/account/deposit', isLoggedIn, accountManager.deposit, function(req, res) {
        req.flash("success", "Your deposit was successful.");
        res.render('deposit.ejs', { title: title , message: req.flash('success')});
    })
//----------------------------------------------
    //Logout -----------------------------------
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    })

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

    //Otherwise redirect to home page
    console.log("Not authenticated, redirecting");
    res.redirect('/');
}
