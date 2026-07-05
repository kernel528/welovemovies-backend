if (process.env.USER) require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./errors/errorHandler");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");

// Add routes here
app.get("/", (req, res) => {
    res.send("Welcome to the We Love Movies API Query Service!<br>" +
        "Build: v2.5.1, using Node.js, Express, and PostgreSQL v18.4<br>" +
        "For more information, please visit: https://github.com/kernel528/welovemovies-backend<br>");
});
app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);

app.use(errorHandler);

module.exports = app;
