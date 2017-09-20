// ./app/models/user.js

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//define the schema for our user
var userSchema = new mongoose.Schema({
    disabled: Boolean,
    admin: Boolean,
    accountNumber: Number,
    email: String,
    password : String,
    balance: Number,
    statements: []
});

//Methods

//generate a hash for the password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model("User", userSchema);