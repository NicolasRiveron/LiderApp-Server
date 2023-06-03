const express = require("express");
const { API_VERSION } = require("./constants");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Static
app.use(express.static("uploads"));

//CORS
app.use(cors());

//Routings
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user");
const moduleRoutes = require("./router/module");
const exerciseRoutes = require("./router/exercise");
const questionRoutes = require("./router/question");
const answerRoutes = require("./router/answer");

//Config Routings
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, moduleRoutes);
app.use(`/api/${API_VERSION}`, exerciseRoutes);
app.use(`/api/${API_VERSION}`, questionRoutes);
app.use(`/api/${API_VERSION}`, answerRoutes);

module.exports = app;