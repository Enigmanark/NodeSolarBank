var User = require('./models/user.js');

var deposit = function(req, res, next) {
    var deposit = req.body.deposit;
    User.findOne({ "local.email" : req.user.local.email }, function(err, user) {
        if(err) return next(err);
        if(user) {
            user.local.balance += deposit;
            user.save();
            return next();
        }
        else {
            req.flash("Not-found", "Could not find user");
            res.redirect("error.ejs");
        }
    })
}

exports.deposit = deposit;