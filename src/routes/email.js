var express = require("express");
var router = express.Router();

var emailController = require("../controllers/emailController");

router.post("/enviarEmail", emailController.enviarEmail);


module.exports = router;