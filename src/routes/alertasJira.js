var express = require("express");
var router = express.Router();
var alertasJiraController = require("../controllers/alertasJiraController");
    router.get("/buscarAlertasJira", alertasJiraController.buscarAlertasJira);

module.exports = router;