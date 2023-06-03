const {logInfoRequest, logErrorRequest, logSuccessRequest} = require("../utils/logger");
const Question = require("../models/question");
const Exercise = require("../models/exercise");

async function createQuestion(req, res){
    logInfoRequest("POST","QUESTION","CREATE QUESTION");
    const question = new Question(req.body);

    question.save()
    .then((questionStored) => {
        if(question.exercise){

            updateExercise(question.exercise, questionStored._id);
        } 
        logSuccessRequest("REQUEST CORRECTA", req, questionStored);
        res.status(200).send(questionStored);
    })
    .catch((error) => {
        logErrorRequest("Error al almacenar la pregunta en base de datos", error.message);
        res.status(400).send({msg: "Error al almacenar la pregunta en base de datos"})
    });
    
}

async function getQuestions(req, res){
    const {exercise} = req.query;
    let response = null;

    logInfoRequest("GET", "QUESTIONS", "GET ALL QUESTIONS");
    
    try {

        if(exercise === undefined){
            response = await Question.find().sort({order: "asc"});
        } else {
            response = await Question.find({exercise: exercise}).sort({order: "asc"});
        }
    
        logSuccessRequest("REQUEST CORRECTA", req, response);
        res.status(200).send(response);
    } catch (error) {
        
        logErrorRequest("No se encontraron preguntas", error.message);
        res.status(400).send({msg: "No se encontraron preguntas"})
    }
    
}

async function getQuestionById(req, res){

    logInfoRequest("GET", "QUESTION", "GET QUESTION BY ID");
    const {id} = req.params;
    let response = await Question.findById({_id: id});
    
    if(!response){

        logErrorRequest("No se encontro la pregunta",  "No se encontro la pregunta");
        res.status(400).send({msg: "No se encontro la pregunta"});
    } else {
        
        logSuccessRequest("REQUEST CORRECTA", req, response);
        res.status(200).send(response);
    } 
}

async function updateQuestion(req, res){
    logInfoRequest("PATCH","QUESTION","UPDATE QUESTION");
    const questionData = req.body;
    const {id} = req.params;
    const oldVersion = await Question.findById({_id: id});

    Question.findByIdAndUpdate({_id: id}, questionData , { new: true })
    .then((questionStored) => {

        if(questionData.exercise && oldVersion.exercise != questionData.exercise){

            updateExercise(questionData.exercise, questionStored._id);
            deleteExercise(oldVersion.exercise, questionStored._id);
        } 

        logSuccessRequest("REQUEST CORRECTA", req, questionStored);
        res.status(200).send(questionStored);
    })
    .catch((error) => {
        logErrorRequest("Error al actualizar la pregunta en base de datos", error.message);
        res.status(400).send({msg: "Error al actualizar la pregunta en base de datos"})
    });
    
}

async function deleteQuestion(req, res){
    logInfoRequest("DELETE","QUESTION","DELETE QUESTION");
    const {id} = req.params;

    Question.findByIdAndDelete({_id: id})
    .then((questionDeleted) => {
        deleteExercise(questionDeleted.exercise, questionDeleted._id);
        logSuccessRequest("REQUEST CORRECTA", req, questionDeleted);
        res.status(200).send(questionDeleted);
    })
    .catch((error) => {
        logErrorRequest("Error al eliminar la pregunta en base de datos", error.message);
        res.status(400).send({msg: "Error al eliminar la pregunta en base de datos"})
    });
    
}

////////////////////////////AUX
async function updateExercise(exerciseId, questionId){
    let exerciseData = await Exercise.findById({_id: exerciseId});

    if(exerciseData &&  !exerciseData.questions.includes(questionId)) {

        exerciseData.questions.push(questionId);
        
        Exercise.findByIdAndUpdate({_id: exerciseId}, exerciseData )
        .then(() => {})
        .catch(error => {

            logErrorRequest("Error al actualizar el ejercicio", error.message);
        });
    }
}

async function deleteExercise(exerciseId, questionId){
    let exerciseData = await Exercise.findById({_id: exerciseId});

    if(exerciseData &&  exerciseData.questions.includes(questionId)) {

        exerciseData.questions = exerciseData.questions.filter((id) => id.toString() != questionId.toString());

        Exercise.findByIdAndUpdate({_id: exerciseId}, exerciseData)
        .then(() => {})
        .catch(error => {

            logErrorRequest("Error al actualizar el ejercicio", error.message);
        });
    }
}
////////////////////////////AUX

module.exports = {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
}