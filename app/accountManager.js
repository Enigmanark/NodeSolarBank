var User = require('./models/user.js');

var deposit = function(req, res, next) {
    var deposit = req.body.deposit;
    User.findOne({ "email" : req.user.email }, function(err, user) {
        if(err) return next(err);
        if(user) {
            user.balance += deposit;
            user.save();
            return next();
        }
        else {
            req.flash("Not-found", "Could not find user");
            res.redirect("error.ejs", {message: req.flash("Not-found")});
        }
    })
}

exports.deposit = deposit;