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
            //Generate a random 9 digit number
            var accNumber = Number(Math.random().toString().slice(2, 11));
            //now check if this number has already been used
            console.log("Now querying for the account number");
            User.findOne( { "accountNumber" : accNumber }, function(error, u) {
                if(error) {
                    console.log(error);
                }
                console.log("Just checked if it was unique");
                //If we didn't find a user with that number then
                if(u) {
                    console.log("Account number was the same, that's a problem.");
                }
                else {
                    console.log("Not found, so it's unique");
                    var newUser = new User(); //Make a new user and set it's fields
                    newUser.email = email; //set the email
                    newUser.accountNumber = accNumber; //set the account number
                    newUser.password = newUser.generateHash(password); //encrypt the password
                    newUser.save(function(err) { //save the user
                        generatingAccountNumber = false; //stop the while loop
                    });
                    console.log("User should be created, so finished");
                    return next(); //once we reach here, we're finished so return next()
                }
            });
        }
    });
}