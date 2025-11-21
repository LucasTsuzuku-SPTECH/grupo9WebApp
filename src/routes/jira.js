var express = require("express");
var router = express.Router();
var jiraController = require("../controllers/jiraController");
    router.get("/buscarChamadosJira", jiraController.buscarChamadosJira);

module.exports = router;