const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
    fneData: {
        troop: String,
        leader: {
            totem: String
        },
        explorer: {
            patrol: String,
            patrolRole: String
        }
    },
    firstName: String,
    lastName: String,
    email: String,
    hash: String,
    token: String
});

module.exports = userSchema;
