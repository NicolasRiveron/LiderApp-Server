const express = require("express");
const ModuleController = require("../controllers/module");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/module", [md_auth.checkAuth], ModuleController.createModule);
api.get("/modules" ,[md_auth.checkAuth], ModuleController.getModules);
api.get("/module/:id", [md_auth.checkAuth], ModuleController.getModuleById);
api.patch("/module/:id", [md_auth.checkAuth], ModuleController.updateModule);
api.delete("/module/:id", [md_auth.checkAuth], ModuleController.deleteModule);

module.exports = api;