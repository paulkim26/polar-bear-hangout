const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let gamedataSchema = new Schema({
    userID: Schema.Types.ObjectId,
    gameID: String,
    data: Schema.Types.Mixed
}, {
    collection: "gamedata"
});



module.exports = gamedataSchema;
