const {logInfoRequest, logErrorRequest, logSuccessRequest} = require("../utils/logger");
const Module = require("../models/module");

async function createModule(req, res){
    logInfoRequest("POST","MODULE","CREATE MODULE");
    const module = new Module(req.body);

    module.save()
    .then((moduleStored) => {
        logSuccessRequest("REQUEST CORRECTA", req, moduleStored);
        res.status(200).send(moduleStored);
    })
    .catch((error) => {
        logErrorRequest("Error al almacenar el modulo en base de datos", error.message);
        res.status(400).send({msg: "Error al almacenar el modulo en base de datos"})
    });
    
}

async function getModules(req, res){
    let response = await Module.find().sort({order: "asc"});

    logInfoRequest("GET", "MODULES", "GET ALL MODULES");

    logSuccessRequest("REQUEST CORRECTA", req, response);
    res.status(200).send(response);
}

async function getModuleById(req, res){

    logInfoRequest("GET", "MODULE", "GET MODULE BY ID");
    const {id} = req.params;
    let response = await Module.findById({_id: id});
    
    if(!response){

        logErrorRequest("No se encontro modulo",  "No se encontro modulo");
        res.status(400).send({msg: "No se encontro modulo"});
    } else {
        
        logSuccessRequest("REQUEST CORRECTA", req, response);
        res.status(200).send(response);
    } 
}

async function updateModule(req, res){
    logInfoRequest("PATCH","MODULE","UPDATE MODULE");
    const moduleData = req.body;
    const {id} = req.params;

    Module.findByIdAndUpdate({_id: id}, moduleData , { new: true })
    .then((moduleStored) => {
        logSuccessRequest("REQUEST CORRECTA", req, moduleStored);
        res.status(200).send(moduleStored);
    })
    .catch((error) => {
        logErrorRequest("Error al actualizar modulo en base de datos", error.message);
        res.status(400).send({msg: "Error al actualizar modulo en base de datos"})
    });
    
}

async function deleteModule(req, res){
    logInfoRequest("DELETE","MODULE","DELETE MODULE");
    const {id} = req.params;

    Module.findByIdAndDelete({_id: id})
    .then((moduleDeleted) => {
        logSuccessRequest("REQUEST CORRECTA", req, moduleDeleted);
        res.status(200).send(moduleDeleted);
    })
    .catch((error) => {
        logErrorRequest("Error al eliminar modulo en base de datos", error.message);
        res.status(400).send({msg: "Error al eliminar modulo en base de datos"})
    });
    
}

module.exports = {
    createModule,
    getModules,
    getModuleById,
    updateModule,
    deleteModule
}