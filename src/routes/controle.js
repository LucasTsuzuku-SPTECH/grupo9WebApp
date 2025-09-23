var express = require("express");
var router = express.Router();

var controleController = require("../controllers/controleController");

router.get("/hospitais", function (req, res) {
    controleController.listarHospitais(req, res);
});

router.put("/editar/:id", controleController.editarUsuario);

module.exports = router;
