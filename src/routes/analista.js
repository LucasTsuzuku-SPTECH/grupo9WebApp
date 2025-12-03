var express = require("express");
var router = express.Router();

var analistaController = require("../controllers/analistaController");

router.get("/semanal", function (req, res) {
    analistaController.buscarSemanal(req, res);
});

router.get("/mensal", function (req, res) {
    analistaController.buscarMensal(req, res);
});

router.get("/anual", function (req, res) {
    analistaController.buscarAnual(req, res);
});

module.exports = router;