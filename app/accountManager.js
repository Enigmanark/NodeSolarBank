// ./app/accountManager.js

var User = require('./models/user.js');
//=================================================================
//============Deposit==============================================
//=================================================================
var deposit = function(req, res, next) {
    User.findOne({ "email" : req.user.email }, function(err, user) { //Find the user by email
        if(err) return next(err);
        if(user) { //If user is found
            if(user.balance == null) user.balance = 0; //if balance is null set it to 0, can happen if the user is new
            var deposit = Number(req.body.deposit); //Convert the string from the deposit form to a number
            user.balance += deposit; //Add the deposit to the users balance
            user.save(function(err) { //Query the database for a save
                if(err) throw err;
                return next(); //Continue on
            });
            
        }
        //Error handling
        else {
            req.flash("UserNotFound", "Could not find user");
            res.redirect("error.ejs", {message: req.flash("UserNotFound")});
        }
    })
}
//=================================================================
//Withdraw=========================================================
//=================================================================
var withdraw = function(req, res, next) {
    User.findOne({ "email" : req.user.email }, function(err, user) { //Find the user by email
        if(err) return next(err);
        if(user) { //If the user is found
            if(user.balance == 0) { //If you're trying to make a withdrawl and you have 0, then we don't even need to check
               // console.log("Balance was 0")
                res.redirect("/acount/withdraw?error=true"); //Redirect
            }
            else if(user.balance == null) { //Same, if the balance is 0 then we don't need to check just redirect
                user.balance = 0;
                user.save(function (err) { //Go ahead and set to 0 though and save
                    if(err) throw err;
                    //console.log("Balance was null");
                    res.redirect("/account/withdraw?error=true");
                });
            }
            var withdraw = Number(req.body.withdraw);
            var balance = user.balance - withdraw;
            if(balance > 0) { //If the user had enough money then withdraw it and save
                user.balance = balance;
                user.save(function(err) { //save the user after withdrawing
                    if(err) throw err;
                    res.redirect("/account/withdraw?success=true"); //Redirect to get with success if withdrew
                });
            } else {
                //console.log("Withdraw is " + withdraw);
                //console.log("User balance is " + user.balance);
                //console.log("Balance was not above 0, balance was " + balance);
                res.redirect("/account/withdraw?error=true"); //redirect if user didn't have enough
            }  
            
        }
        //Error handling
        else {
            req.flash("UserNotFound", "Could not find user");
            res.redirect("error.ejs", {message: req.flash("UserNotFound")});
        }
    })
}

exports.withdraw = withdraw;
exports.deposit = deposit;