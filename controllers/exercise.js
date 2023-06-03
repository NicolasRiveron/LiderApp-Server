const {logInfoRequest, logErrorRequest, logSuccessRequest} = require("../utils/logger");
const Exercise = require("../models/exercise");
const Module = require("../models/module");

async function createExercise(req, res){
    logInfoRequest("POST","EXERCISE","CREATE EXERCISE");
    const exercise = new Exercise(req.body);

    exercise.save()
    .then((exerciseStored) => {

        if(exercise.module){
            updateModule(exercise.module, exercise._id);
        } 
        logSuccessRequest("REQUEST CORRECTA", req, exerciseStored);
        res.status(200).send(exerciseStored);
    })
    .catch((error) => {

        logErrorRequest("Error al almacenar el ejercicio en base de datos", error.message);
        res.status(400).send({msg: "Error al almacenar el ejercicio en base de datos"})
    });
    
}


async function getExercises(req, res){
    const {module} = req.query;
    let response = null;

    logInfoRequest("GET", "EXERCISE", "GET ALL EXERCISES");
    
    try {

        if(module === undefined){

            response = await Exercise.find().sort({order: "asc"});
        } else {

            response = await Exercise.find({module: module}).sort({order: "asc"});
        }
    
        logSuccessRequest("REQUEST CORRECTA", req, response);
        res.status(200).send(response);
    } catch (error) {
        
        logErrorRequest("No se encontraron ejercicios", error.message);
        res.status(400).send({msg: "No se encontraron ejercicios"})
    }
    
}

async function getExerciseById(req, res){

    logInfoRequest("GET", "EXERCISE", "GET EXERCISE BY ID");
    const {id} = req.params;
    let response = await Exercise.findById({_id: id});
    
    if(!response){

        logErrorRequest("No se encontro el ejercicio",  "No se encontro el ejercicio");
        res.status(400).send({msg: "No se encontro el ejercicio"});
    } else {
        
        logSuccessRequest("REQUEST CORRECTA", req, response);
        res.status(200).send(response);
    } 
}

async function updateExercise(req, res){
    logInfoRequest("PATCH","EXERCISE","UPDATE EXERCISE");
    const exerciseData = req.body;
    const {id} = req.params;
    const oldVersion = await Exercise.findById({_id: id});

    Exercise.findByIdAndUpdate({_id: id}, exerciseData , { new: true })
    .then((exerciseStored) => {

        if(exerciseData.module && oldVersion.module != exerciseData.module){

            updateModule(exerciseData.module, exerciseStored._id);
            deleteModule(oldVersion.module, exerciseStored._id);
        } 

        logSuccessRequest("REQUEST CORRECTA", req, exerciseStored);
        res.status(200).send(exerciseStored);
    })
    .catch((error) => {

        logErrorRequest("Error al actualizar el ejercicio en base de datos", error.message);
        res.status(400).send({msg: "Error al actualizar el ejercicio en base de datos"})
    });
    
}

async function deleteExercise(req, res){
    logInfoRequest("DELETE","EXERCISE","DELETE EXERCISE");
    const {id} = req.params;

    Exercise.findByIdAndDelete({_id: id})
    .then((exerciseDeleted) => {

        logSuccessRequest("REQUEST CORRECTA", req, exerciseDeleted);
        deleteModule(exerciseDeleted.module, id);
        res.status(200).send(exerciseDeleted);
    })
    .catch((error) => {

        logErrorRequest("Error al eliminar el ejercicio en base de datos", error.message);
        res.status(400).send({msg: "Error al eliminar el ejercicio en base de datos"})
    });
    
}

////////////////////////////AUX
async function updateModule(moduleId, excerciseId){
    let moduleData = await Module.findById({_id: moduleId});

    if(moduleData &&  !moduleData.exercises.includes(excerciseId)) {

        moduleData.exercises.push(excerciseId);
        
        Module.findByIdAndUpdate({_id: moduleId}, moduleData )
        .then(() => {})
        .catch(error => {

            logErrorRequest("Error al actualizar el modulo", error.message);
        });
    }
}

async function deleteModule(moduleId, excerciseId){
    let moduleData = await Module.findById({_id: moduleId});

    if(moduleData &&  moduleData.exercises.includes(excerciseId)) {
        
        moduleData.exercises = moduleData.exercises.filter(id => id.toString() != excerciseId.toString());
        
        Module.findByIdAndUpdate({_id: moduleId}, moduleData )
        .then(() => {})
        .catch(error => {

            logErrorRequest("Error al actualizar el modulo", error.message);
        });
    }
}
////////////////////////////AUX


module.exports = {
    createExercise,
    getExercises,
    getExerciseById,
    updateExercise,
    deleteExercise
}