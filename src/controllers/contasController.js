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

function mostrarContasHospital(req, res) {
    var fk_hospital = req.params.fkHospital; 
    contasModel.listarHospitalContas(fk_hospital)
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



function deletarConta(req, res) {
    const id = req.params.id; 

    contasModel.deletarConta(id)
        .then(() => {
            res.json({ message: "Usuário deletado com sucesso!" });
        })
        .catch((erro) => {
            console.error(erro);
            res.status(500).json({ error: "Erro ao deletar usuário" });
        });
}

function alterarAcesso(req, res) {
    const id = req.params.id;
    const novoStatus = req.body.statusUser;

    contasModel.atualizarAcesso(id, novoStatus)
        .then(() => {
            res.json({ message: "Status atualizado com sucesso!" });
        })
        .catch((erro) => {
            console.error(erro);
            res.status(500).json({ error: "Erro ao atualizar status" });
        });
}



module.exports = {
    mostrarContas,
    mostrarContasHospital,
    deletarConta,
    alterarAcesso
}
