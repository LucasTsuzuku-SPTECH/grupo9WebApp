var express = require("express");
var router = express.Router();

var maquinasController = require("../controllers/maquinasController");

router.get("/maquinas", function (req, res) {
    maquinasController.mostrarMaquinas(req, res);
});

router.delete("/deleteMaquina/:id", function(req,res){
    maquinasController.deletarMaquina(req,res);
})
router.put("/alterarAcesso/:id", function(req,res){
    maquinasController.alterarAcesso(req,res);
});
router.post("/cadastrar", function(req,res){
    maquinasController.cadastrar(req,res);
});


module.exports = router;
