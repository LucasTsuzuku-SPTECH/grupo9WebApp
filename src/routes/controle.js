var express = require("express");
var router = express.Router();

var controleController = require("../controllers/controleController");

router.get("/hospitais", function (req, res) {
    controleController.listarHospitais(req, res);
});

router.get("/hospitais/:idHospital/ventiladores", function(req, res) {
    controleController.listarVentiladores(req, res);
});

router.delete("/ventiladores/:idVentilador", function(req, res) {
    controleController.deletarVentilador(req, res);
});

router.post("/ventiladores", controleController.criarVentilador);

module.exports = router;
