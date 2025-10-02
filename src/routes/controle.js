var express = require("express");
var router = express.Router();

var controleController = require("../controllers/controleController");

// HOSPITAIS
router.get("/hospitais", controleController.listarHospitais);
router.post("/criar", controleController.criarHospital);
router.get("/buscar/:idHospital", controleController.buscarHospital);
router.put("/editar/:idHospital", controleController.editarHospital);
router.delete("/deletar/:idHospital", controleController.deletarHospital);

// VENTILADORES
router.get("/hospitais/:idSala/ventiladores", controleController.listarVentiladores);
router.post("/ventiladores", controleController.criarVentilador);
router.get("/ventiladores/buscar/:idVentilador/:idSala", controleController.buscarVentilador);
router.put("/ventiladores/atualizar/:idVentilador", controleController.atualizarVentilador);
router.delete("/ventiladores/:idVentilador", controleController.deletarVentilador);

// MODELOS
router.get("/modelos", controleController.listarModelos);

// ENDEREÇOS
router.get("/enderecos", controleController.listarEnderecos);
router.post("/enderecos", controleController.criarEndereco);

router.get("/ventiladores/:idVentilador/parametros", controleController.listarParametros);
router.get("/ventiladores/:idVentilador/componentes", controleController.buscarComponentes);
router.put("/componentes/atualizar", controleController.atualizarComponente);



module.exports = router;
