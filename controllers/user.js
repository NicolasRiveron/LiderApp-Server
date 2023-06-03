const {logInfoRequest, logErrorRequest, logSuccessRequest} = require("../utils/logger");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const image = require("../utils/image");

async function getMe(req, res) {
    const {user_id} = req.user;
    const response = await User.findById(user_id);

    logInfoRequest("GET", "USER", "GETME");

    if(!response){

        logErrorRequest("No se encontro usuario",  "No se encontro usuario");
        res.status(400).send({msg: "No se encontro usuario"});
    } else {
        
        logSuccessRequest("REQUEST CORRECTA", req, response);
        res.status(200).send(response);
    }   
}

async function getUsers(req, res){
    const {isActive} = req.query;
    let response = null;

    logInfoRequest("GET", "USERS", "GET ALL USERS");
    
    if(isActive === undefined){
        response = await User.find();
    } else {
        response = await User.find({isActive})
    }

    logSuccessRequest("REQUEST CORRECTA", req, response);
    res.status(200).send(response);
}

async function createUser(req, res){
    logInfoRequest("POST","USER","CREATE USER");
    const { password, email } = req.body;
    const user = new User({...req.body, statistics: {}, isActive: true, isAdmin: false});
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password,salt);
    user.password = hashPassword;
    user.email = email.toLowerCase();

    if(req.files.avatar){
        const imagePath = image.getFileName(req.files.avatar);
        user.avatar = imagePath;
    }

    user.save()
    .then((userStored) => {
        logSuccessRequest("REQUEST CORRECTA", req, userStored);
        res.status(200).send(userStored);
    })
    .catch((error) => {
        logErrorRequest("Error al almacenar usuario en base de datos", error.message);
        res.status(400).send({msg: "Error al almacenar usuario en base de datos"})
    });
    
}

async function updateUser(req, res){
    logInfoRequest("PATCH","USER","UPDATE USER");
    const userData = req.body;
    const {id} = req.params;

    if(userData.password){
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(userData.password,salt);
        userData.password = hashPassword;
    } else {
        delete userData.password;
    }

    if(req.files.avatar){
        const imagePath = image.getFileName(req.files.avatar);
        userData.avatar = imagePath;
    }

    User.findByIdAndUpdate({_id: id}, userData, { new: true })
    .then((userStored) => {
        logSuccessRequest("REQUEST CORRECTA", req, userStored);
        res.status(200).send(userStored);
    })
    .catch((error) => {
        logErrorRequest("Error al actualizar usuario en base de datos", error.message);
        res.status(400).send({msg: "Error al actualizar usuario en base de datos"})
    });
    
}

async function deleteUser(req, res){
    logInfoRequest("DELETE","USER","DELETE USER");
    const {id} = req.params;

    User.findByIdAndDelete({_id: id})
    .then((userDeleted) => {
        logSuccessRequest("REQUEST CORRECTA", req, userDeleted);
        res.status(200).send(userDeleted);
    })
    .catch((error) => {
        logErrorRequest("Error al eliminar usuario en base de datos", error.message);
        res.status(400).send({msg: "Error al eliminar usuario en base de datos"})
    });
    
}

module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser
}