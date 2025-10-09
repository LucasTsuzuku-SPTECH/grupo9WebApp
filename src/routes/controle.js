var express = require("express");
var router = express.Router();

var controleController = require("../controllers/controleController");

// HOSPITAIS
router.get("/hospitais", controleController.listarHospitais);
router.get("/listar/salas/:idHospital", controleController.listarSala);
router.post("/criar", controleController.criarHospital);
router.get("/buscar/:idHospital", controleController.buscarHospital);
router.put("/editar/:idHospital", controleController.editarHospital);
router.delete("/deletar/:idHospital", controleController.deletarHospital);

// VENTILADORES
router.get("/hospitais/:idHospital/ventiladores", controleController.listarVentiladores);
router.get("/hospitais/:idSala/ventiladores", controleController.listarVentiladoresSala);
router.post("/ventiladores", controleController.criarVentilador);
router.get("/ventiladores/buscar/:idVentilador/:idSala", controleController.buscarVentilador);
router.put("/ventiladores/atualizar/:idVentilador", controleController.atualizarVentilador);
router.delete("/ventiladores/:idVentilador", controleController.deletarVentilador);

// MODELOS
router.get("/modelos", controleController.listarModelos);

// ENDEREÇOS
router.get("/enderecos", controleController.listarEnderecos);
router.post("/enderecos", controleController.criarEndereco);

// COMPONENTES E PARAMETROS
router.get("/ventiladores/:idVentilador/parametros", controleController.listarParametros);
router.get("/ventiladores/:idVentilador/componentes", controleController.buscarComponentes);
router.put("/componentes/atualizar", controleController.atualizarComponente);
router.post("/componentes/criar", controleController.criarComponenteEParametro);
router.delete("/componentes/deletar/:idComponente/:idParametro", controleController.deletarComponenteEParametro);

// SALAS
router.get("/hospitais/salas", controleController.listarSalas);
router.post("/salas", controleController.criarSala);

module.exports = router;
