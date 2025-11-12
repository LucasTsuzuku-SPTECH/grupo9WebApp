const express = require("express");
const router = express.Router();
const contasController = require("../controllers/contasController");

// router.get("/contas", contasController.listar);
router.get("/listarHospitais", (req, res) => {
  contasController.listarHospitais(req, res);
});

router.get("/contasEmpresa/:idEmpresa", contasController.listarEmpresa);
router.put("/alterarAcessoEmpresa/:id", contasController.alterarAcessoEmpresa);
router.delete("/deleteContaEmpresa/:id", contasController.deleteContaEmpresa);
router.put("/editarContaEmpresa/:id", contasController.editarContaEmpresa);
router.post("/cadastrarFuncEmpresa", function (req, res) {
    contasController.cadastrarFuncEmpresa(req, res);
})

router.get("/contasHospital/:idHospital", contasController.listarHospital);
router.put("/alterarAcessoHospital/:id", contasController.alterarAcessoHospital);
router.delete("/deleteContaHospital/:id", contasController.deleteContaHospital);
router.put("/editarContaHospital/:id", contasController.editarContaHospital);
router.post("/cadastrarFuncHospital", function (req, res) {
    contasController.cadastrarFuncHospital(req, res);
})




module.exports = router;
