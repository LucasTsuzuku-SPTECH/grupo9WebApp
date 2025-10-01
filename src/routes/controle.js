var express = require("express");
var router = express.Router();

var controleController = require("../controllers/controleController");

router.get("/hospitais", function (req, res) {
    controleController.listarHospitais(req, res);
});

router.get("/hospitais/:idSala/ventiladores", function(req, res) {
    controleController.listarVentiladores(req, res);
});

router.delete("/ventiladores/:idVentilador", function(req, res) {
    controleController.deletarVentilador(req, res);
});

router.get("/modelos", function (req, res) {
    controleController.listarModelos(req, res);
});

router.post("/ventiladores", controleController.criarVentilador);

// buscar ventilador específico
router.get('/ventiladores/buscar/:idVentilador/:idSala', (req, res) => {
  controleController.buscarVentilador(req, res);
});

// Atualizar ventilador
router.put("/ventiladores/atualizar/:idVentilador", function(req, res) {
    controleController.atualizarVentilador(req, res);
});

router.get("/enderecos", controleController.listarEnderecos);
router.post("/enderecos", controleController.criarEndereco);
router.post("/criar", controleController.criarHospital);
router.get("/buscar/:idHospital", controleController.buscarHospital);
router.put("/editar/:idHospital", controleController.editarHospital);
router.delete("/deletar/:idHospital", controleController.deletarHospital);



module.exports = router;
