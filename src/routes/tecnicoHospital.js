var express = require("express");
var router = express.Router();

var tecnicoHospitalController = require("../controllers/tecnicoHospitalController");

router.get("/diario", function (req, res) {
    tecnicoHospitalController.listarDiario(req, res);
});

router.get("/semanal", function (req, res) {
    tecnicoHospitalController.listarSemanal(req, res);
});

router.get("/mensal", function (req, res) {
    tecnicoHospitalController.listarMensal(req, res);
});

router.get("/anual", function (req, res) {
    tecnicoHospitalController.listarAnual(req, res);
});

router.get("/areas/:fk_hospital", function (req, res) {
    tecnicoHospitalController.listarAreas(req, res);
});

module.exports = router;