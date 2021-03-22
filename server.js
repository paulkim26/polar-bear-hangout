const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const http = require("http").createServer(app);

//libraries
const dotenv = require('dotenv').config();
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const favicon = require("serve-favicon");

//connect to database
const dataService = require("./modules/data-service.js");
const myData = dataService(process.env.MONGODB);

//enable sockets
const socketService = require("./modules/socket-service.js");
socketService(http);

//middleware settings
app.use("/static", express.static(__dirname + "/static"));

app.use(bodyParser.json());

app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: "main"
}));
app.set("view engine", ".hbs");

app.use(favicon(path.join(__dirname,'static','img','favicon.ico')));

//view routes
app.get("/", (req, res) => {
    res.render("home", {home: true});
});

app.get("/registeruser", (req, res) => {
    res.render("userregistration");
});

app.get("/morsetransmission", (req, res) => {
    res.render("morsetransmission", {morseCode: true});
});

app.get("/morsereception", (req, res) => {
    res.render("morsereception", {morseCode: true});
});

app.get("/cryptograms", (req, res) => {
    res.render("cryptograms", {cryptography: true});
});

app.get("/cryptogram", (req, res) => {
    res.render("cryptogram", {cryptography: true});
});

app.get("/scores", (req, res) => {
    res.render("scores", {scores: true});
});

app.get("/dev/multiplayertest", (req, res) => {
    res.render("multiplayertest");
});

app.post("/registeruser", (req,res)=>{
    myData.addUser(req.body).then(obj=>{
        res.status(200).json(obj);
    }).catch(err=>{
        res.status(406).json({message:err});
    })
});

app.post("/login", (req,res)=>{
    myData.login(req.body).then(result=>{
        res.json(result);
    }).catch(err=>{
        res.json({
            success:false,
            message:err
        });
    });
});

app.post("/login/:token", (req,res)=>{
    myData.getUserByToken(req.params.token).then(user=>{
        res.json({
            success: true,
            user: user
        });
    }).catch(err=>{
        res.json({
            success: false,
            message: err
        })
    });
})

//api routes
app.get("/api/troops", (req, res) => {
    myData.getTroops().then(troops=>{
        res.json(troops);
    }).catch(err=>{
        res.json({message:err});
    })
})

app.get("/api/patrols/:troop", (req, res) => {
    myData.getPatrols(req.params.troop).then(patrols=>{
        res.json(patrols);
    }).catch(err=>{
        res.json({message:err});
    });
})

app.post("/api/getscores/:gameid", (req, res) => {
    myData.getScores(req.params.gameid).then(result=>{
        res.json(result);
    }).catch(err=>{
        res.json({message:err});
    });
});

app.post("/api/getgamedata", (req,res) => {
    myData.getGameData(req.body.userID, req.body.gameID).then(result=>{
        res.json(result);
    }).catch(err=>{
        res.json({message:err});
    });
});

app.post("/api/setgamedata", (req,res)=>{
    myData.setGameData(req.body).then(result=>{
        res.json(result);
    }).catch(err=>{
        res.json({message:err});
    });
});

//catch-all route - must succeed other routes
app.use(function(req, res) {
    res.status(404).render("notfound");
});

myData.initialize().then(()=>{
    http.listen(HTTP_PORT,()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});
