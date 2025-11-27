var express = require("express");
var router = express.Router();

var medidaController = require("../controllers/medidaController");

router.get("/umidade", function (req, res) {
    medidaController.buscarUmidade(req, res);
});

router.get("/monitoramento/:idHospital", function (req, res) {
    medidaController.buscarMonitoramento(req, res);
});

module.exports = router;