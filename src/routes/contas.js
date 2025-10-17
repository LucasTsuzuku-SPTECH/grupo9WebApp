const express = require("express");
const router = express.Router();
const contasController = require("../controllers/contasController");

router.get("/contas", contasController.listar);
router.get("/contasHospital/:idHospital", contasController.listarHospital);
router.get("/contasEmpresa/:idEmpresa", contasController.listarEmpresa);
router.put("/alterarAcesso/:id", contasController.alterarAcesso);
router.delete("/deleteConta/:id", contasController.deletar);

router.post("/cadastrarFunc", function (req, res) {
    contasController.cadastrarFunc(req, res);
})

router.get("/listarHospitais", (req, res) => {
  contasController.listarHospitais(req, res);
});

router.put("/editar/:id", contasController.editarUsuario);

module.exports = router;
