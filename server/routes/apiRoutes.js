require("dotenv").config({ path: "../env" });
const routes = require("express").Router();
const apiCalls = require("./apiCalls");

const multer = require("multer");
const upload = multer();
// const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
// AWS.config.setPromisesDependency();
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1"
});
const s3 = new AWS.S3({ params: { Bucket: "reactdailydashpictures" } });

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'reactdailydashpictures',
//         acl: "public-read",
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString())
//         }
//     })
// })
// const singleUpload = upload.single("file");


routes.post("/imageupload", upload.single("file"), function (req, res) {
    // singleUpload(req, res, function (err) {
    //     err && console.log(err)
    //     return res.json({ imageUrl: file.location });
    // })
    // console.log(req);
    const s3Upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: "dailydashpictures",
            Key: req.file.originalname,
            Body: req.file.buffer,
            ACL: "public-read"
        }
    });
    let upload = s3Upload.promise()
    upload.then(function (uploaded) {
        console.log(uploaded)
        res.json(uploaded.Location)
    }).catch(err => console.log(err));
    // console.log(req.body.files);
})
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
    try {
        const finance = await apiCalls.stocks(req.body.stock);
        res.json(finance);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Stock Autocomplete

routes.post("/stockautocomplete", async function (req, res) {
    console.log(req.body);
    try {
        let stockAutoComplete = await apiCalls.stockAutoComplete(req.body.search);
        res.json(stockAutoComplete);

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Logout and reload the app

routes.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = routes;
