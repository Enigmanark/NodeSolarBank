// ./app/routes.js

module.exports = function(app, passport, title) {
//----------------------------------------------
    //Home Page --------------------------------
//----------------------------------------------
    app.get("/", function(req, res) {
        console.log("Routing /");
        res.render('index.ejs', { title: title });
    });
    //-------------------------------------------
    //Login -------------------------------------
    //-------------------------------------------
    app.get('/login', function(req, res) {
        console.log("Routing /login");
        //render the page and pass any flash data if it exists
        res.render('login.ejs', { title: title, message: req.flash('loginMessage') } );
    });

    //process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', //Forward to profile page after login
        failureRedirect: '/login', //Redirect to try to login again
        failureFlash: true //allow sending error messages
    }))
//-----------------------------------------------
    //Sign up -----------------------------------
//-----------------------------------------------
    app.get('/signup', function(req, res) {
        console.log("Routing /signup");
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
    //Profile ----------------------------------
    //This will be protected so you have to be logged in to visit this url, we will use the isLoggedIn() function
    app.get('/profile', isLoggedIn, function(req, res) {
        console.log("Routing /profile"); 
        res.render('profile.ejs', {
            title: title,
            user : req.user //get the user from session and pass to template
        });
    });
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
