// const db = require("../models");
const routes = require("express").Router();
const passport = require("passport");
// const db = require("../models");
//HTML routes

// Load index page
routes.get("/", function(req, res) {
    // console.log(req.user);
    // if (req.user) {
    //     res.render("index", {});
    //     res.send({loggedIn: true});
    // } else {
    //     res.render("index", {});
    // };
    res.render("index", {});
});

routes.get("/users:id", function(req, res) {
    // let userId = req.params.id.substr(5);
    db.User.findOne({authId: req.params.id}, {include: db.Task}, {plain: true}).then(info => {
        // console.log(info.get({plain: true}));
        let userInfo = info.get({plain: true});
        console.log(userInfo);
        res.render("index", {user: userInfo});
    });
});
// Load example page and pass in an example by id
// app.get("/example/:id", function(req, res) {
//   db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
//     res.render("example", {
//       example: dbExample
//     });
//   });
// });

// Render 404 page for any unmatched routes
// routes.get("*", function(req, res) {
//     res.render("404");
// });

//Export the routes object

module.exports = routes;
