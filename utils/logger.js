const logInfoRequest = (type, controller, router) => {
    console.log("#################################");
    console.log(`${type} - ${controller} - ${router}`);
    console.log("#################################");
    console.log("\n");
}

const logErrorRequest = (contextMessage, catchedMessage) => {
    console.log(`CONTEXT ERROR: ${contextMessage}`);
    console.log(`CATCHED ERROR: ${catchedMessage}`);
    console.log("\n");
}

const logSuccessRequest = (message, req, userStored) => {
    console.log(`SUCCESS: ${message}`);
    console.log("\n");
    console.log(`-----------REQUEST------------`);
    console.log(req.body);
    console.log("\n");
    console.log(`-----------RESPONSE------------`);
    console.log(userStored);
    console.log("\n");
}

module.exports = {
    logInfoRequest,
    logErrorRequest,
    logSuccessRequest
}