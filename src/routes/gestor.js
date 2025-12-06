var express = require("express");
var router = express.Router();

var gestorController = require("../controllers/gestorController");

router.get("/diario", function (req,res){
    gestorController.listarDiario(req,res);
})

router.get("/semanal", function (req, res) {
    gestorController.listarSemanal(req, res);
});

router.get("/mensal", function (req, res) {
    gestorController.listarMensal(req, res);
});

router.get("/anual", function (req, res) {
    gestorController.listarAnual(req, res);
});

module.exports = router;