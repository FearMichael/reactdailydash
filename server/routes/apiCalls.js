const axios = require("axios");
const unirest = require("unirest");
require("dotenv").config({ path: "../.env" });

const apiCall = {

    // weather: (zipCode) => {
    //     return new Promise((resolve, reject) => {
    //         let locationSearch = `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${process.env.WEATHER}&q=${zipCode}`;
    //         let locationID;
    //         axios.get(locationSearch).then(function (response) {
    //             locationID = response.data[0].ParentCity.Key;
    //             let weatherSearch = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationID}?apikey=${process.env.WEATHER}`;
    //             axios.get(weatherSearch).then(function (weatherInfo) {
    //                 resolve(weatherInfo.data);
    //             })
    //                 .catch(err => {
    //                     reject(err);
    //                 })
    //         });
    //     });
    // },

    weather: async (zipCode) => {
        try {
            let location = await axios.get(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zipCode}&facet=state&facet=timezone&facet=dst`);
            console.log(location.data);
            if (location.data.records[0]) {
                let weather = await axios.get(`https://api.darksky.net/forecast/${process.env.DARKSKY}/${location.data.records[0].fields.latitude},${location.data.records[0].fields.longitude}?exclude=currently,minutely,hourly`);
                console.log(weather);
                return weather.data
            } else {
                return new Error("No results for zip code location")
            }
        } catch (err) {
            return err.message
        }
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
        return new Promise((resolve, reject) => {

            axios.get(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=${search}&region=US`,
                {
                    headers: {
                        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST, "X-RapidAPI-Key": process.env.RAPIDAPI_KEY
                    }
                })
                .then(function (stocks) {
                    console.log(stocks.data)
                    resolve(stocks.data);
                }).catch(err => reject(err));
        });
    },

    stockAutoComplete: (search) => {
        return new Promise((resolve, reject) => {
            axios.get(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/auto-complete?lang=en&region=US&query=${search}`,
                {
                    headers: {
                        "x-rapidapi-host": process.env.AUTOCOMPLETE_HOST,
                        "x-rapidapi-key": process.env.AUTOCOMPLETE_KEY
                    }
                }).then(function (autoComplete) {
                    console.log(autoComplete.data.ResultSet.Result);
                    resolve(autoComplete.data.ResultSet.Result)
                }).catch(err => reject(err));
        })
    }
};

module.exports = apiCall;