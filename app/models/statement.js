// ./app/models/statement.js

var mongoose = require('mongoose');

//define the schema blueprint for statement

var statementSchema = new mongoose.Schema( {
    description : String,
    amount : Number
});

