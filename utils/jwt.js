const jwt = require("jsonwebtoken");
const {JWT_SECRET_KEY, API_VERSION, IP_SERVER, PORT} = require("../constants");

function createAccessToken(user){
    const expToken = new Date();
    expToken.setHours(expToken.getHours() + 3);

    const payload = {
        token_type: "access",
        user_id: user._id,
        iat: Date.now(),
        exp: expToken.getTime()
    };

    return jwt.sign(payload, JWT_SECRET_KEY);
}

function createRefreshToken(user){
    const expToken = new Date();
    expToken.getMonth(expToken.getMonth() + 1);

    const payload = {
        token_type: "refresh",
        user_id: user._id,
        iat: Date.now(),
        exp: expToken.getTime()
    };

    return jwt.sign(payload, JWT_SECRET_KEY);
}

function decoded(token){
    return jwt.decode(token, JWT_SECRET_KEY, true);
}

function createLinkRefreshPassword(rootLink,password, email, id){
    const newSecret = JWT_SECRET_KEY + password;
    const token = jwt.sign({email: email, id:id}, newSecret, {
        expiresIn: "5m"
    });
    return `http://${rootLink}/${id}/${token}`;
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    decoded,
    createLinkRefreshPassword
}