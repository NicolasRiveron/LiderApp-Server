const {logInfoRequest, logErrorRequest, logSuccessRequest} = require("../utils/logger");
const Answer = require("../models/answer");
const Question = require("../models/question");

async function createAnswer(req, res){
    logInfoRequest("POST","ANSWER","CREATE ANSWER");
    const answer = new Answer(req.body);

    answer.save()
    .then((answerStored) => {
        if(answer.question){
            updateQuestion(answer.question, answer._id);
        } 
        logSuccessRequest("REQUEST CORRECTA", req, answerStored);
        res.status(200).send(answerStored);
    })
    .catch((error) => {
        logErrorRequest("Error al almacenar la respuesta en base de datos", error.message);
        res.status(400).send({msg: "Error al almacenar la respuesta en base de datos"})
    });
    
}

async function getAnswers(req, res){
    const {exercise} = req.query;
    let response = null;

    logInfoRequest("GET", "ANSWERS", "GET ALL ANSWERS");
    
    try {

        if(exercise === undefined){
            response = await Answer.find().sort({order: "asc"});
        } else {
            response = await Answer.find({exercise: exercise}).sort({order: "asc"});
        }
    
        logSuccessRequest("REQUEST CORRECTA", req, response);
        res.status(200).send(response);
    } catch (error) {
        
        logErrorRequest("No se encontraron respuestas", error.message);
        res.status(400).send({msg: "No se encontraron respuestas"})
    }
    
}

async function getAnswerById(req, res){

    logInfoRequest("GET", "ANSWER", "GET ANSWER BY ID");
    const {id} = req.params;
    let response = await Answer.findById({_id: id});
    
    if(!response){

        logErrorRequest("No se encontro la respuesta",  "No se encontro la respuesta");
        res.status(400).send({msg: "No se encontro la respuesta"});
    } else {
        
        logSuccessRequest("REQUEST CORRECTA", req, response);
        res.status(200).send(response);
    } 
}

async function updateAnswer(req, res){
    logInfoRequest("PATCH","ANSWER","UPDATE ANSWER");
    const answerData = req.body;
    const {id} = req.params;
    const oldVersion = await Answer.findById({_id: id});

    Answer.findByIdAndUpdate({_id: id}, answerData , { new: true })
    .then((answerStored) => {

        if(answerStored.question){
            updateQuestion(answerData.question, answerStored._id);
            deleteQuestion(oldVersion.question, answerStored._id); 
        } 

        logSuccessRequest("REQUEST CORRECTA", req, answerStored);
        res.status(200).send(answerStored);
    })
    .catch((error) => {
        logErrorRequest("Error al actualizar la respuesta en base de datos", error.message);
        res.status(400).send({msg: "Error al actualizar la respuesta en base de datos"})
    });
    
}

async function deleteAnswer(req, res){
    logInfoRequest("DELETE","ANSWER","DELETE ANSWER");
    const {id} = req.params;

    Answer.findByIdAndDelete({_id: id})
    .then((answerDeleted) => {
        deleteQuestion(answerDeleted.question, answerDeleted._id);
        logSuccessRequest("REQUEST CORRECTA", req, answerDeleted);
        res.status(200).send(answerDeleted);
    })
    .catch((error) => {
        logErrorRequest("Error al eliminar la respuesta en base de datos", error.message);
        res.status(400).send({msg: "Error al eliminar la respuesta en base de datos"})
    });
    
}

////////////////////////////AUX
async function updateQuestion(questionId, answerId){
    let questionData = await Question.findById({_id: questionId});

    if(questionData &&  !questionData.answers.includes(answerId)) {

        questionData.answers.push(answerId);
        
        Question.findByIdAndUpdate({_id: questionId}, questionData )
        .then(() => {})
        .catch(error => {

            logErrorRequest("Error al actualizar la pregunta", error.message);
        });
    }
}

async function deleteQuestion(questionId, answerId){
    let questionData = await Question.findById({_id: questionId});

    if(questionData &&  questionData.answers.includes(answerId)) {
        
        questionData.answers = questionData.answers.filter(id => id.toString() != answerId.toString());
        
        Question.findByIdAndUpdate({_id: questionId}, questionData )
        .then(() => {})
        .catch(error => {

            logErrorRequest("Error al actualizar la pregunta", error.message);
        });
    }
}
////////////////////////////AUX

module.exports = {
    createAnswer,
    getAnswers,
    getAnswerById,
    updateAnswer,
    deleteAnswer
}