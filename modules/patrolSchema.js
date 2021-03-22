const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let patrolSchema = new Schema({
    "name": String,
    "troop": String
});

module.exports = patrolSchema;
