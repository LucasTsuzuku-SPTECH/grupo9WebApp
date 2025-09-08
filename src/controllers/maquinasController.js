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
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var perfil = req.body.perfilServer;
    var fk_empresa = req.body.fkEmpresaServer;
    var fk_hospital = req.body.fkHospitalServer;
    
    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    }else {
    
        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
            
        usuarioModel.cadastrar(nome, email, senha, perfil, fk_empresa, fk_hospital)
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
}


module.exports = {
    mostrarMaquinas,
    deletarMaquina,
    // alterarAcesso
}
