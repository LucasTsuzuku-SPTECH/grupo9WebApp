var controleModel = require("../models/controleModel");

function listarHospitais(req, res) {
    controleModel.listarHospitais()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.status(204).send("Nenhum hospital encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Erro ao buscar hospitais: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

async function editarUsuario(req, res){
  const id = req.params.id;
  const { nome, email, perfil } = req.body;

  try {
    const resultado = await controleModel.editarUsuario(id, nome, email, perfil);
    res.json({ message: "Usuário atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao editar usuário" });
  }
}

module.exports = {
    listarHospitais,
    editarUsuario
};
