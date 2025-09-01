var contasModel = require("../models/contasModel");

function mostrarContas(req, res) {
    contasModel.listarTodasContas()
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum usuário encontrado!");
            }
        })
        .catch((erro) => {
            console.error(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    mostrarContas
}
