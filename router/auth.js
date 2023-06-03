const express = require("express");
const AuthController = require("../controllers/auth");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/auth/register" , AuthController.register);
api.post("/auth/login", AuthController.login);
api.post("/auth/refresh_access_token", AuthController.refreshAccessToken);
api.post("/auth/forgot_password", AuthController.forgotPassword);
api.post("/auth/reset_password/:id/:token", [md_auth.resetPasswordAuth], AuthController.resetPassword);
module.exports = api;