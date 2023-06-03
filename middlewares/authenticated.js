const {logErrorRequest, logSuccessRequest} = require("../utils/logger");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../constants");
const User = require("../models/user");


function checkAuth(req, res, next){

    if(!req.headers.authorization){
        logErrorRequest("No fue agregado el token de autorizacion");
        res.status(403).send({msg: "No fue agregado el token de autorizacion"});
    }

    const token = req.headers.authorization.replace("Bearer ","");

    try{
        const payload = jwt.decode(token);
        const {exp} = payload;
        const currentData = new Date().getTime();

        if(exp <= currentData){
            logErrorRequest("El token expiro", "El token expiro");
            return res.status(400).sent({msg: "El token expiro"});
        }

        req.user = payload;
        next();
    } catch (error){
        logErrorRequest("Token invalido", error.message);
        return res.status(400).send({msg:"Token invalido"});
    }
}


function resetPasswordAuth(req, res, next){

    const {id, token} = req.params;

    User.findById({_id: id})
    .then((userFounded) => {
        
        if(!userFounded){
            logErrorRequest("Error del servidor", "Error del servidor");
            res.status(500).send({msg: "Error del servidor"});
        }

        const secret = JWT_SECRET_KEY +  userFounded.password.toString();

        try {
            
            const verify = jwt.verify(token, secret);
            req.user = userFounded;
            next();
        } catch (error) {
            logErrorRequest("Token invalido", error.message);
            return res.status(400).send({msg:"Token invalido"});
        }
        
    }) 
}

module.exports = {
    checkAuth,
    resetPasswordAuth
}