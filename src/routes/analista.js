var express = require("express");
var router = express.Router();

var analistaController = require("../controllers/analistaController");

router.get("/semanal", function (req, res) {
    analistaController.listarSemanal(req, res);
});

router.get("/mensal", function (req, res) {
    analistaController.listarMensal(req, res);
});

router.get("/anual", function (req, res) {
    analistaController.listarAnual(req, res);
});

module.exports = router;