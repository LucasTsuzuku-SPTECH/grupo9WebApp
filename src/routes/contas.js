var express = require("express");
var router = express.Router();

var contasController = require("../controllers/contasController");

router.get("/contas", function (req, res) {
    contasController.mostrarContas(req, res);
});

module.exports = router;
