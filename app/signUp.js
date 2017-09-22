// ./app/signUp.js

var User = require("./models/user.js");

module.exports = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    //Check if there's an account already with that email
    User.findOne( { "email" : email}, function(err, user) {
        if(err) throw err;
        if(user) { //If we found a user, then signup fails, redirect
            res.redirect("/signup?error=true");
        }
        else {
            loop();
        }
    });

    var loop = function() {
        //Generate a random 9 digit number
        var accNumber = Number(Math.random().toString().slice(2, 11));
        //now check if this number has already been used
        User.findOne( { "accountNumber" : accNumber }, function(err, u) {
            if(err) {
                console.log(err);
            }
            //If we didn't find a user with that number then
            if(u) {
                loop();
            }
            else {
                var newUser = new User(); //Make a new user and set it's fields
                newUser.admin = false;
                newUser.disabled = false;
                newUser.email = email; //set the email
                newUser.accountNumber = accNumber; //set the account number
                newUser.password = newUser.generateHash(password); //encrypt the password
                newUser.save(function(err) { //save the user
                    return next(); //once we reach here, we're finished so return next()
                });
                
            }
        });
    }
}