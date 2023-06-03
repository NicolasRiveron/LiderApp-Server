const express = require("express");
const ExerciseController = require("../controllers/exercise");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/exercise", [md_auth.checkAuth], ExerciseController.createExercise);
api.get("/exercises" ,[md_auth.checkAuth], ExerciseController.getExercises);
api.get("/exercise/:id", [md_auth.checkAuth], ExerciseController.getExerciseById);
api.patch("/exercise/:id", [md_auth.checkAuth], ExerciseController.updateExercise);
api.delete("/exercise/:id", [md_auth.checkAuth], ExerciseController.deleteExercise);

module.exports = api;