const mongoose = require("mongoose");

//schema
const troopSchema = require("./troopSchema.js");
const patrolSchema = require("./patrolSchema.js");
const userSchema = require("./userSchema.js");
const gamedataSchema = require("./gamedataSchema.js");

//encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

//functions
function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

module.exports = function(connectionString){

    let db;
    let Troop;
    let Patrol;
    let User;
    let GameData;

    return {

        initialize: function(){
            return new Promise((resolve,reject)=>{
                db = mongoose.createConnection(connectionString,{ useNewUrlParser: true,useUnifiedTopology: true });

                db.on('error', ()=>{
                    reject();
                });
                db.once('open', ()=>{
                    Troop = db.model("troops", troopSchema);
                    Patrol = db.model("patrols", patrolSchema);
                    User = db.model("users", userSchema);
                    GameData = db.model("gamedata", gamedataSchema);
                    resolve();
                });
            });
        },

        getTroops: function() {
            return new Promise((resolve,reject)=>{
                Troop.find().exec()
                .then(troops=>{
                    resolve(troops);
                })
                .catch(err=>{
                    reject(err);
                });
            });
        },

        getPatrols: function(troop) {
            return new Promise((resolve,reject)=>{
                Patrol.find({troop: troop}).exec()
                .then(patrols=>{
                    resolve(patrols);
                })
                .catch(err=>{
                    reject(err);
                });
            });
        },

        getUserByToken: function(token) {
            return new Promise((resolve,reject)=>{
                User.findOne({token: token}).exec().then(foundUser=>{
                    if (foundUser) {
                        resolve(foundUser);
                    } else {
                        reject("No token match.");
                    }
                })
                .catch(err=>{
                    reject(err);
                });
            });
        },

        addUser: function(userData) {
            return new Promise((resolve, reject)=>{
                //check email is unique
                User.findOne({email: userData.email}).exec().then((foundUser)=>{
                    if (foundUser) {
                        resolve({
                            success: false,
                            message: `A user with the email address '${userData.email}' already exists.`
                        });
                    } else {
                        //encrypt password
                        bcrypt.genSalt(saltRounds, function(err, salt){
                            bcrypt.hash(userData.password, salt, function(err, hash) {
                                //replace password with hash
                                delete userData.password;
                                userData.hash = hash;

                                //add user to collection
                                const newUser = new User(userData);
                                newUser.save((err)=>{
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve({
                                            success: true,
                                            message: `New user: ${newUser._id} successfully added.`
                                        });
                                    }
                                });
                            });
                        });
                    }
                })
                .catch(err=>{
                    reject(err);
                });

            });
        },

        login: function(userData) {
            return new Promise((resolve, reject)=>{
                User.findOne({email: userData.email}).exec().then((foundUser)=>{
                    if (!foundUser) {
                        reject("Unable to find user: " + userData.email);
                    } else {
                        bcrypt.compare(userData.password, foundUser.hash, function(err, result) {
                            if (result === true) {

                                const token = randomString(50);

                                User.updateOne(
                                    {email: userData.email},
                                    {$set: {
                                        token: token
                                    }}
                                ).exec().then(function(){
                                    resolve({
                                        success: true,
                                        message: "Login successful.",
                                        token: token
                                    })
                                });
                            } else {
                                reject("Password doesn't match.");
                            }
                        });
                    }
                })
                .catch(err=>{
                    reject(err);
                });
            });
        },

        getScores: function(gameID) {
            return new Promise((resolve, reject)=>{
                GameData.aggregate([
                    {$match: {
                        gameID: gameID
                    }},
                    {$lookup: {
                        from: "users",
                        localField: "userID",
                        foreignField: "_id",
                        as: "userData"
                    }},
                    {$project: {
                        gameID: 1,
                        userID: 1,
                        data: 1,
                        "userData.firstName": 1,
                        "userData.lastName": 1,
                        "userData.fneData": 1
                    }}
                ],(err, data) => {
                    //parse results
                    const results = [];
                    data.forEach(row=>{
                      let patrol = "";
                      let player = "";
                      let score = null;

                      if (row.userData.length > 0) {
                        const userData = row.userData[0];
                        player = `${userData.firstName} ${userData.lastName.charAt(0)}.`;

                        if (userData.hasOwnProperty("fneData")) {
                          const fneData = userData.fneData;

                          if (fneData.hasOwnProperty("explorer")) {
                            patrol = fneData.explorer.patrol;
                          }

                          if (fneData.hasOwnProperty("leader")) {
                            const totem = fneData.leader.totem;
                            player = `${totem} (${player})`;
                          }
                        }
                      }

                      switch(gameID) {
                        case "cryptograms":
                          score = row.data.completed.length;
                          break;
                        default:
                          score = row.data.score;
                      }

                      results.push({
                        rank: null,
                        score: score,
                        patrol: patrol,
                        player: player,
                        userID: row.userID
                      });
                    });

                    //sort results
                    results.sort((a,b)=>{
                      if (a.score < b.score) {
                        return 1;
                      }
                      if (a.score > b.score) {
                        return -1;
                      }
                      return 0;
                    });

                    //rank results
                    if (results.length >= 1) {
                      let rank = 1;
                      let lastScore = results[0].score;
                      results.forEach(row=>{
                        if (row.score != lastScore) {
                          rank++;
                        }
                        row.rank = rank;
                        lastScore = row.score;
                      });
                    }

                    resolve(results);
                });
            });
        },

        getGameData: function(userID, gameID){
            return new Promise((resolve, reject)=>{
                GameData.findOne({userID: userID, gameID: gameID}).exec().then(foundGameData=>{
                    if (foundGameData) {
                        resolve(foundGameData.data);
                    } else {
                        resolve(null);
                    }
                })
                .catch(err=>{
                    reject(err);
                });
            });
        },

        setGameData: function(gameData){
            return new Promise((resolve, reject)=>{
                //parse updated game properties
                const updatedProps = {};
                Object.keys(gameData.data).forEach(property => {

                    updatedProps["data." + property] = gameData.data[property];
                });

                GameData.updateOne(
                    {
                        userID: gameData.userID,
                        gameID: gameData.gameID
                    },
                    {
                        $set: updatedProps
                    },
                    {
                        upsert: true //insert if no row found
                    }
                ).exec().then(function(){
                    resolve({
                        success: true,
                        message: `Game data successfully saved.`
                    })
                }).catch(err=>{
                    reject(err);
                });
            });
        },
    }
};
