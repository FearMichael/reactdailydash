const axios = require("axios");
const unirest = require("unirest");
require("dotenv").config({ path: "../../dailydash/.env" });

const apiCall = {

    weather: (zipCode) => {
        return new Promise(resolve => {
            let locationSearch = `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${process.env.WEATHER}&q=${zipCode}`;
            let locationID;
            axios.get(locationSearch).then(function (response) {
                locationID = response.data[0].ParentCity.Key;
                let weatherSearch = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationID}?apikey=${process.env.WEATHER}`;
                // will need to format data and have front end render some graphics/icons based on what the weather is
                axios.get(weatherSearch).then(function (weatherInfo) {
                    resolve(weatherInfo.data);
                });
            });
        });
    },

    news: async (topic) => {
        // let newsSearch = `https://newsapi.org/v2/everything?q=${topic}&apiKey=${process.env.NEWS}`;
        console.log(topic);
        let newsSearch = `https://newsapi.org/v2/everything?q=${topic}&apiKey=${process.env.NEWS}`
        return new Promise(resolve => {
            axios.get(newsSearch).then(function (newsInfo) {
                resolve(newsInfo.data);
                // console.log(newsInfo.data);
            })
                .catch(err => {
                    if (err) { console.log(err) }
                })
        });
    },

    stocks: async (search) => {
        return new Promise(resolve => {
            unirest.get(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-quotes?region=US&lang=en&symbols=${search}`)
                .header("X-RapidAPI-Host", process.env.RAPIDAPI_HOST)
                .header("X-RapidAPI-Key", process.env.RAPIDAPI_KEY)
                .end(function (result) {
                    console.log(result.body.quoteResponse.result);
                    // console.log(result.data);
                    resolve(result.body.quoteResponse.result);
                });
        });
    },

    stockAutoComplete: async (search) => {
        return new Promise(resolve => {
            unirest.get(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/auto-complete?lang=en&region=US&query=${search}`)
                .header("x-rapidapi-host", process.env.AUTOCOMPLETE_HOST)
                .header("x-rapidapi-key", process.env.AUTOCOMPLETE_KEY)
                .end(function (result) {
                    // console.log(result.body.quoteResponse.result);
                    console.log(result.body.ResultSet);
                    resolve(result.body.ResultSet.Result);
                });
        })
    }
};

module.exports = apiCall;