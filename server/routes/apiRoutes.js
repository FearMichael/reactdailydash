require("dotenv").config({ path: "../env" });
// const db = require("../models");
const routes = require("express").Router();
// const passport = require("passport");
const apiCalls = require("./apiCalls");
// const axios = require("axios");

//Routes object


//add notes to database
routes.post("/addtasks", function (req, res) {
    db.Task.create({
        text: req.body.task,
        completed: false,
        UserId: req.body.user
    }, {
        include: db.User
    }).then(function () {
        db.Task.findAll({ where: { UserId: req.body.user }, raw: true }).then(function (allTasks) {
            res.json(allTasks);
        });
    });
});

//Get Tasks
routes.post("/gettasks", function (req, res) {
    db.Task.findAll({ where: { UserId: req.body.user }, raw: true }).then(function (allTasks) {
        res.json(allTasks);
    });
});

//Delete Tasks

routes.post("/deletetask", function (req, res) {
    // console.log(req.body.id);
    db.Task.destroy({ where: { id: req.body.id } });
});

//NEWS API
//Route = /api/news
routes.post("/news",
    async function (req, res) {
        const news = await apiCalls.news(req.body.news);
        res.json(news);
    });

//WEATHER API

routes.post("/weather", async function (req, res) {
    console.log(req.body)
    try {
        const weather = await apiCalls.weather(req.body.zip);
        res.json(weather);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//STOCK API

routes.post("/stocks", async function (req, res) {
    // console.log(req.body);
    const finance = await apiCalls.stocks(req.body.stock);
    res.json(finance);
});

routes.post("/stockautocomplete", async function (req, res) {
    console.log(req.body);
    // const autoComplete = await apiCalls.stockAutoComplete(req.body.search);
    apiCalls.stockAutoComplete(req.body.search).then(data => res.json(data)).catch(err => { throw err });
    // res.json(autoComplete);
})

//Authentication

// routes.get("/auth/google",
//     passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/plus.login"] }));

// routes.get("/authenticate",
//     // passport.authenticate("google", { failureRedirect: "/" }),
//     function(req, res) {
//         console.log(req.body);
//         console.log(req.body.user);
//         // res.redirect("/authenticate");
//     });

//Finds or Creates user once logged in
// routes.get("/authenticate", passport.authenticate("google", { failureRedirect: "/", session: false }), function(req, res) {
//     // console.log(req.user.id);
//     console.log("----------------------------");
//     console.log(req.user);
//     // console.log(req.accessToken);

//     // db.User.findOrCreate({
//     //     where: {authId: req.user.id},
//     //     defaults: {
//     //         familyName: req.user.name.familyName,
//     //         givenName: req.user.name.givenName,
//     //         picture: req.user.photos[0].value,
//     //         gender: req.user._json.gender,
//     //         locale: req.user._json.locale
//     //     }
//     // })
//     //     .then(([dbObject, created]) => {
//     //         console.log(dbObject.get({plain: true}));
//     //     });
//     // res.redirect("/users" + req.user.id);
//     // res.cookie({name: "superSecret", });
//     // res.send("Got it");
//     if (req.user) {
//         payload = {
//             name: "George Costanza",
//             superuser: false,
//         };
//         let privateKey = "AlphaRomeo8567";
//         let token = jwt.sign(payload, privateKey);
//         console.log(`
//         ---------------
//         ${req.user} 
//         is verified with ${token}
//         ---------------
//         `);
//         let cookieOptions = {
//             httpOnly: true,
//             expires: 0
//         };
//         res.cookie("permissionGranted", token, cookieOptions);
//         console.log(token);
//     };
//     res.redirect("/");
// });

routes.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = routes;
