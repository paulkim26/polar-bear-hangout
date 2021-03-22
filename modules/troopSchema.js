const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let troopSchema = new Schema({
    "name": String
});

module.exports = troopSchema;
