const contasModel = require("../models/contasModel");

async function listar(req, res) {
  try {
    const contas = await contasModel.listarContas();
    res.json(contas);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar contas");
  }
}

async function listarHospital(req, res) {
  const { idHospital } = req.params;

  try {
    const contas = await contasModel.listarContasHospital(idHospital);
    res.json(contas);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar contas");
  }
}

async function listarEmpresa(req, res) {
  const { idEmpresa } = req.params;

  try {
    const contas = await contasModel.listarContasEmpresa(idEmpresa);
    res.json(contas);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar contas");
  }
}

async function alterarAcesso(req, res) {
  const { statusUser } = req.body;
  const { id } = req.params;

  try {
    await contasModel.alterarAcesso(id, statusUser);
    res.json({ msg: "Status alterado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao alterar status");
  }
}

async function editarUsuario(req, res){
  const id = req.params.id;
  const { nome, email, perfil} = req.body;

  try {
    const resultado = await contasModel.editarUsuario(id, nome, email, perfil);
    res.json({ message: "Usuário atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao editar usuário" });
  }
}

async function deletar(req, res) {
  const { id } = req.params;
  try {
    await contasModel.deletar(id);
    res.json({ msg: "Usuário deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao deletar usuário");
  }
}

function cadastrarFunc(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
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
        
        contasModel.cadastrarFunc(nome, email, senha, fk_empresa, fk_hospital, perfil)
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

function listarHospitais(req, res){
    contasModel.listarHospitais()
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}

module.exports = { listar, alterarAcesso, deletar, cadastrarFunc, listarHospitais, editarUsuario, listarHospital,listarEmpresa };
