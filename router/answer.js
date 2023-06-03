const express = require("express");
const AnswerController = require("../controllers/answer");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/answer", [md_auth.checkAuth], AnswerController.createAnswer);
api.get("/answers" ,[md_auth.checkAuth], AnswerController.getAnswers);
api.get("/answer/:id", [md_auth.checkAuth], AnswerController.getAnswerById);
api.patch("/answer/:id", [md_auth.checkAuth], AnswerController.updateAnswer);
api.delete("/answer/:id", [md_auth.checkAuth], AnswerController.deleteAnswer);

module.exports = api;