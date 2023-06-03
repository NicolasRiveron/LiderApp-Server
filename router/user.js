const express = require("express");
const UserController = require("../controllers/user");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");

const md_upload = multiparty({uploadDir: "../liderapp-server/uploads/userAvatar"});
const api = express.Router();

api.get("/user/me", [md_auth.checkAuth], UserController.getMe);
api.get("/users", [md_auth.checkAuth], UserController.getUsers);
api.post("/user", [md_auth.checkAuth, md_upload], UserController.createUser);
api.patch("/user/:id", [md_auth.checkAuth, md_upload], UserController.updateUser);
api.delete("/user/:id", [md_auth.checkAuth], UserController.deleteUser);

module.exports = api;