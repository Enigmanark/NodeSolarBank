// ./app/signUp.js

var User = require("./models/user.js");

module.exports = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    //Check if there's an account already with that email
    User.findOne( { "email" : email}, function(err, user) {
        if(user) { //If we found a user, then signup fails, redirect
            res.redirect("/signup?error=true");
        }
        else { //No user was found so create a new user
            newUser = new User();
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.save(function(err) {
                return next();
            })
        }
    });
}