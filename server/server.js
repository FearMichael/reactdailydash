require("dotenv").config();
const express = require("express");
// const htmlRoutes = require("./routes/htmlRoutes");
const apiRoutes = require("./routes/apiRoutes");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

// Routes
app.use("/api", apiRoutes);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
})
app.listen(PORT, function () {
    console.log("Server listening on " + PORT);
});

module.exports = app;