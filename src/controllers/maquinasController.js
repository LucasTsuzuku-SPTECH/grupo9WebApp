var maquinasModel = require("../models/maquinasModel");

function mostrarMaquinas(req, res) {
    maquinasModel.listarTodasMaquinas()
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhuma máquina encontrada!");
            }
        })
        .catch((erro) => {
            console.error(erro);
            res.status(500).json(erro.sqlMessage);
        });
}


function deletarMaquina(req, res) {
    const id = req.params.id; 

    maquinasModel.deletarMaquina(id)
        .then(() => {
            res.json({ message: "Máquina deletada com sucesso!" });
        })
        .catch((erro) => {
            console.error(erro);
            res.status(500).json({ error: "Erro ao deletar máquina" });
        });
}

// function alterarAcesso(req, res) {
//     const id = req.params.id;
//     const novoStatus = req.body.statusUser;

//     maquinasModel.atualizarAcesso(id, novoStatus)
//         .then(() => {
//             res.json({ message: "Status atualizado com sucesso!" });
//         })
//         .catch((erro) => {
//             console.error(erro);
//             res.status(500).json({ error: "Erro ao atualizar status" });
//         });
// }



module.exports = {
    mostrarMaquinas,
    deletarMaquina,
    // alterarAcesso
}
