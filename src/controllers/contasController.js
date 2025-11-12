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



async function alterarAcessoHospital(req, res) {
  const { statusUser } = req.body;
  const { id } = req.params;

  try {
    await contasModel.alterarAcessoHospital(id, statusUser);
    res.json({ msg: "Status alterado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao alterar status");
  }
}

async function alterarAcessoEmpresa(req, res) {
  const { statusUser } = req.body;
  const { id } = req.params;

  try {
    await contasModel.alterarAcessoEmpresa(id, statusUser);
    res.json({ msg: "Status alterado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao alterar status");
  }
}




async function editarContaEmpresa(req, res){
  const id = req.params.id;
  const { nome, email, perfil} = req.body;

  try {
    const resultado = await contasModel.editarContaEmpresa(id, nome, email, perfil);
    res.json({ message: "Usuário atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao editar usuário" });
  }
}
async function editarContaHospital(req, res){
  const id = req.params.id;
  const { nome, email, perfil} = req.body;

  try {
    const resultado = await contasModel.editarContaHospital(id, nome, email, perfil);
    res.json({ message: "Usuário atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao editar usuário" });
  }
}




async function deleteContaEmpresa(req, res) {
  const { id } = req.params;
  try {
    await contasModel.deleteContaEmpresa(id);
    res.json({ msg: "Usuário deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao deletar usuário");
  }
}
async function deleteContaHospital(req, res) {
  const { id } = req.params;
  try {
    await contasModel.deleteContaHospital(id);
    res.json({ msg: "Usuário deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao deletar usuário");
  }
}




function cadastrarFuncHospital(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var perfil = req.body.perfilServer;
    var fkHospital = req.body.fkHospital;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    }else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        
        contasModel.cadastrarFuncHospital(nome, email, senha, perfil, fkHospital)
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
function cadastrarFuncEmpresa(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var perfil = req.body.perfilServer;
    var fk_empresa = req.body.fkEmpresaServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    }else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        
        contasModel.cadastrarFuncEmpresa(nome, email, senha, fk_empresa, perfil)
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

module.exports = { listar, alterarAcessoEmpresa, alterarAcessoHospital, deleteContaEmpresa, deleteContaHospital, cadastrarFuncEmpresa, cadastrarFuncHospital, listarHospitais, editarContaEmpresa, editarContaHospital, listarHospital, listarEmpresa };
