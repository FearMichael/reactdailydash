require("dotenv").config({ path: "../env" });
const routes = require("express").Router();
const apiCalls = require("./apiCalls");
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
