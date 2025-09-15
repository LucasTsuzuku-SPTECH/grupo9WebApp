const { json } = require("express");
var maquinasModel = require("../models/maquinasModel");

function mostrarMaquinas(req, res) {
    console.log("CHEGUEI NA FUNÇÃO MOSTRARMAQUINA")
    maquinasModel.listarTodasMaquinas()
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
                console.log(json(resultado))
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

function cadastrar(req, res){
    var modelo = req.body.modeloServer;
    var serie = req.body.serieServer;
    var sala = req.body.salaServer;
    var andar = req.body.andarServer;
    var fk_empresa = req.body.fkEmpresaServer;
    var fk_hospital = req.body.fkHospitalServer;
    
    // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
            
    maquinasModel.cadastrar(modelo, serie, sala, andar, fk_empresa, fk_hospital)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar o cadastro! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}



module.exports = {
    mostrarMaquinas,
    deletarMaquina,
    cadastrar,
    // alterarAcesso
}
