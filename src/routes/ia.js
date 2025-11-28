var express = require("express");
var router = express.Router();

var iaController = require("../controllers/iaController");

router.post("/perguntar", iaController.perguntar);

module.exports = router;
