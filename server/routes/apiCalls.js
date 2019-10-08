const axios = require("axios");
const unirest = require("unirest");
require("dotenv").config({ path: "../.env" });

const apiCall = {

    weather: (zipCode) => {
        return new Promise((resolve, reject) => {
            let locationSearch = `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${process.env.WEATHER}&q=${zipCode}`;
            let locationID;
            axios.get(locationSearch).then(function (response) {
                locationID = response.data[0].ParentCity.Key;
                let weatherSearch = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationID}?apikey=${process.env.WEATHER}`;
                axios.get(weatherSearch).then(function (weatherInfo) {
                    resolve(weatherInfo.data);
                })
                    .catch(err => {
                        reject(err);
                    })
            });
        });
    },

    news: async (topic) => {
        console.log(topic);
        let newsSearch = `https://newsapi.org/v2/everything?q=${topic}&apiKey=${process.env.NEWS}`
        return new Promise(resolve => {
            axios.get(newsSearch).then(function (newsInfo) {
                resolve(newsInfo.data);
            })
                .catch(err => {
                    if (err) { console.log(err) }
                })
        });
    },

    stocks: async (search) => {
        console.log(search);
        return new Promise(resolve => {
            unirest.get(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=${search}&region=US`)
                .header("X-RapidAPI-Host", process.env.RAPIDAPI_HOST)
                .header("X-RapidAPI-Key", process.env.RAPIDAPI_KEY)
                .end(function (result) {
                    resolve(result.body);
                })
        });
    },

    stockAutoComplete: (search) => {
        return new Promise(resolve => {
            unirest.get(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/auto-complete?lang=en&region=US&query=${search}`)
                .header("x-rapidapi-host", process.env.AUTOCOMPLETE_HOST)
                .header("x-rapidapi-key", process.env.AUTOCOMPLETE_KEY)
                .end(function (result) {
                    resolve(result.body.ResultSet.Result);
                })
                .catch(err => {
                    if (err) { console.log(err) }
                })
        })
    }
};

module.exports = apiCall;