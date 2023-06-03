const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");
const {logInfoRequest, logErrorRequest, logSuccessRequest} = require("../utils/logger");
const User = require("../models/user");
const {EMAILAPP, PSWAPP } = require("../constants");
const nodemailer = require("nodemailer");

function register(req, res){
    
    logInfoRequest("POST", "AUTH", "REGISTER");
    const {firstname, lastname, email, password} = req.body;

    if(!email) {
        logErrorRequest("El email es obligatorio");
        res.status(400).send({msg: "El email es obligatorio"})
    };

    if(!password){
        logErrorRequest("La contraseña es obligatoria");
        res.status(400).send({msg: "La contraseña es obligatoria"});
    }; 

    const user = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        password,
        avatar: "",
        statistics: {},
        isActive: true,
        isAdmin: false
    });

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password,salt);
    user.password = hashPassword;

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


function login(req, res){

    logInfoRequest("POST", "AUTH", "LOGIN");
    const {email, password} = req.body;

    if(!email) {
        logErrorRequest("El email es obligatorio");
        res.status(400).send({msg: "El email es obligatorio"})
    };

    if(!password){
        logErrorRequest("La contraseña es obligatoria");
        res.status(400).send({msg: "La contraseña es obligatoria"});
    }; 

    const emailLowerCase = email.toLowerCase();

    User.findOne({email: emailLowerCase})
    .then((userStored) => {
        bcrypt.compare(password, userStored.password, (bcryptError, check) => {
            if(bcryptError){
                logErrorRequest("Error del servidor", bcryptError.message);
                res.status(500).send({msg: "Error del servidor"});
            } else if (!check){
                logErrorRequest("Contraseña Incorrecta", "Contraseña Incorrecta");
                res.status(500).send({msg: "Contraseña Incorrecta"});
            } else if (!userStored.isActive){
                logErrorRequest("Usuario no autorizado o inactivo", "Usuario no autorizado o inactivo");
                res.status(401).send({msg: "Usuario no autorizado o inactivo"});
            } else {
                const response = {
                    access: jwt.createAccessToken(userStored),
                    refresh: jwt.createRefreshToken(userStored)
                }
                logSuccessRequest("REQUEST CORRECTA", req, response)
                res.status(200).send(response);
            }
        })
    })
    .catch((error) => {
        logErrorRequest("Error del servidor", error.message);
        res.status(500).send({msg: "Error del servidor"})
    });
}

function refreshAccessToken(req, res){
    const {token} = req.body;
    const {user_id} = jwt.decoded(token);

    logInfoRequest("POST", "AUTH", "REFRESH TOKEN");

    if(!token) {
        logErrorRequest("Token es obligatorio");
        res.status(400).send({msg: "Token es obligatorio"})
    };

    User.findOne({_id: user_id})
    .then((userStored) => {
        const response = {
            access: jwt.createAccessToken(userStored)
        }
        logSuccessRequest("REQUEST CORRECTA", req, response)
        res.status(200).send(response);
    })
    .catch((error) => {
        logErrorRequest("Error del servidor", error.message);
        res.status(500).send({msg: "Error del servidor"});
    });
}

function forgotPassword(req, res){
    logInfoRequest("POST", "AUTH", "FORGOT PASSWORD");
    const {email, rootLink} = req.body;
    email = email.toLowerCase();
    User.findOne({email})
    .then((userFounded) => {

        if(!userFounded){
            logErrorRequest("Error del servidor", "Error del servidor");
            res.status(400).send({msg: "Error del servidor"});
        } else {
            const link = jwt.createLinkRefreshPassword(rootLink,userFounded.password, userFounded.email, userFounded._id);
       
            let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: EMAILAPP,
              pass: PSWAPP,
                },
            });
      
            let mailOptions = {
                from: `Equipo de LiderApp <${EMAILAPP}>`,
                to: email,
                subject: "Password Reset",
                html: `
                <div style="text-align: center;font-size: 16px; font-weight: bold; color: black;">
                    <h1 style="font-size: 22px; font-weight: bold;">Has solicitado un cambio de contraseña</h1>
                    Si no fuiste tú, ignora este correo electrónico y asegúrate de que aún puedes iniciar sesión en su cuenta.<br>
                    Si fuiste tú, confirma el cambio de contraseña haciendo <a href="${link}"><strong>CLIC AQUÍ</strong></a>.<br>
                    <em>Ten en cuenta que el link estará activo para crear tu nueva contraseña tan solo por los próximos 5 minutos.</em>
                </div>
                `
            };
      
            transporter.sendMail(mailOptions, 
                function (error, info) {
                    if (error) {
                        
                        throw error;
                    } else {
                        
                        logSuccessRequest("REQUEST CORRECTA", req, link)
                        res.status(200).send(link);
                    }
                }
            );  
        }
    })
    .catch((error) => {
        logErrorRequest("Error del servidor", error.message);
        res.status(400).send({msg: "Error del servidor"})
    });
}

function resetPassword(req, res){
    logInfoRequest("POST", "AUTH", "RESET PASSWORD");
    const user = req.user;
    const {password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password,salt);
    user.password = hashPassword;

    User.findByIdAndUpdate({_id: user._id}, user, { new: true })
    .then((userStored) => {
        logSuccessRequest("REQUEST CORRECTA", req, userStored);
        res.status(200).send(userStored);
    })
    .catch((error) => {
        logErrorRequest("Error al actualizar usuario en base de datos", error.message);
        res.status(400).send({msg: "Error al actualizar usuario en base de datos"})
    });
}

module.exports = {
    register,
    login,
    refreshAccessToken, 
    forgotPassword,
    resetPassword
}