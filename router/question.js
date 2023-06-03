const express = require("express");
const QuestionController = require("../controllers/question");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/question", [md_auth.checkAuth], QuestionController.createQuestion);
api.get("/questions" ,[md_auth.checkAuth], QuestionController.getQuestions);
api.get("/question/:id", [md_auth.checkAuth], QuestionController.getQuestionById);
api.patch("/question/:id", [md_auth.checkAuth], QuestionController.updateQuestion);
api.delete("/question/:id", [md_auth.checkAuth], QuestionController.deleteQuestion);

module.exports = api;