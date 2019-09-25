require("dotenv").config();
var express = require("express");
// var exphbs = require("express-handlebars");
const htmlRoutes = require("./routes/htmlRoutes");
const apiRoutes = require("./routes/apiRoutes");
// const cookieSession = require("cookie-session");
// const session = require("express-session");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
// const GithubStrategy = require("passport-github");



// var db = require("./models");

var app = express();
var PORT = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// app.use(cookieParser());
// app.use(cookieSession({name: "session", keys: ["key1"]}));

// app.use(passport.initialize());
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
// }));
// passport.session();

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/authenticate"
// },
// function(accessToken, refreshToken, profile, done) {
//     console.log(profile);
//     // console.log(profile);
//     // console.log(accessToken);
//     // cookieSession.set({alphaRomeo: accessToken});
//     // URLSearchParams.findOrCreate({googleId: profile.id}, function(err, user) {
//     //     return done(err, user);
//     // });

//     return done(null, profile);
// }
// ));

// passport.use(new GithubStrategy({
//     clientID: process.env.GITHUB_CLIENT,
//     clientSecret: process.env.GITHUB_SECRET,
//     callbackURL: "/authenticate"
// }, function(accessToken, refreshToken, profile, done) {
// console.log(profile);
// if (accessToken) {
//     payload = {
//         name: "George Costanza",
//         email: "supercoolguy@1223.com",
//         superuser: false,
//     };
//     let privateKey = "AlphaRomeo8567";
//     let token = jwt.sign(payload, privateKey, { expiresIn: "1m"});
//     // console.log(`
//     // ---------------
//     // ${req.authInfo._json.name} 
//     // is verified with ${token}
//     // ---------------
//     // `);
//     let cookieOptions = {
//         httpOnly: true
//     };
// res.cookie("permissionGranted", token, cookieOptions);
// }
//     profile.accessToken = accessToken;
//     return done(null, profile); 
// }));

// app.get("/authenticate", passport.authenticate("github", { failureRedirect: "/", session: false }), function(req, res) {
//     // console.log(req.user.id);
//     // console.log("----------------------------");
//     console.log("user");
//     console.log(req.authInfo);
//     console.log(req.user);
//     console.log(req.user.accessToken);
//     console.log("user");
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
//     // if (req.user) {
//     //     payload = {
//     //         name: "George Costanza",
//     //         email: "supercoolguy@1223.com",
//     //         superuser: false,
//     //     };
//         let privateKey = "AlphaRomeo8567";
//         let token = jwt.sign(payload, privateKey, { expiresIn: "1m"});
//         // console.log(`
//         // ---------------
//         // ${req.authInfo._json.name} 
//         // is verified with ${token}
//         // ---------------
//         // `);
//         let cookieOptions = {
//             httpOnly: true
//         };
//         res.cookie("permissionGranted", token, cookieOptions);
//         // console.log(token);
//     // };
//     res.redirect("http://google.com");
// });

// app.get("/auth/github", passport.authenticate("github"));

// const checkAuthorization = function (req, res, next) {

//     // 1. See if there is a token on the request...if not, reject immediately
//     //
//     // console.log(req.cookies);
//     console.log(req.cookies.permissionGranted);
//     const userJWT = req.cookies.permissionGranted;
//     if (!userJWT) {
//         res.send(401, 'Invalid or missing authorization token')
//     } else {
//         try {
//             const userJWTPayload = jwt.verify(userJWT, "AlphaRomeo8567");
//             if (!userJWTPayload) {
//             //Kill the token since it is invalid
//             //
//             // res.clearCookie('twitterAccessJwt')
//                 res.send(401, 'Invalid or missing authorization token')
//             }
//         } catch (err) {
//             console.log(err);
//             res.redirect("/");
//         }
//     }
//     jwt.verify(userJWT, "AlphaRomeo8567", (err, decoded) => {
//         if (err) throw err;
//         console.log(decoded);
//     });
//     console.log("Test passed");
//     next();
// };

// app.post("/verify", checkAuthorization, function(req, res) {
//     res.send(req.body);
// })

// // Handlebars
// app.engine("handlebars", exphbs({defaultLayout: "main"}));
// app.set("view engine", "handlebars");

// Routes
app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

// db.sequelize.sync().then(() => {
app.listen(PORT, function () {
    console.log("Server listening on " + PORT);
});
// });

module.exports = app;