// ./app/models/user.js

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//define the schema for our user
var userSchema = new mongoose.Schema({
    local : {
        email: String,
        password : String
    }
});

//Methods

//generate a hash for the password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model("User", userSchema);