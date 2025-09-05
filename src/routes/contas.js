var express = require("express");
var router = express.Router();

var contasController = require("../controllers/contasController");

router.get("/contas", function (req, res) {
    contasController.mostrarContas(req, res);
});

router.delete("/deleteConta/:id", function(req,res){
    contasController.deletarConta(req,res);
})
router.put("/alterarAcesso/:id", function(req,res){
    contasController.alterarAcesso(req,res);
});


module.exports = router;
