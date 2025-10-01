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

function listarVentiladores(req, res) {
    const idSala = req.params.idSala;
    controleModel.listarVentiladores(idSala)
        .then(resultado => {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.status(204).send("Nenhum ventilador encontrado!");
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar ventiladores: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function deletarVentilador(req, res) {
    const idVentilador = req.params.idVentilador;

    controleModel.deletarVentilador(idVentilador)
        .then(() => {
            res.status(200).json({ message: "Ventilador deletado com sucesso!" });
        })
        .catch(erro => {
            console.error("Erro ao deletar ventilador: ", erro.sqlMessage);
            res.status(500).json({ message: "Erro ao deletar ventilador", erro: erro.sqlMessage });
        });
}

function criarVentilador(req, res) {
    const ventilador = req.body; 

    controleModel.criarVentilador(ventilador)
        .then(() => res.json({ message: "Ventilador criado com sucesso" }))
        .catch(erro => {
            console.error("Erro ao criar ventilador: ", erro.sqlMessage || erro);
            res.status(500).json({ message: "Erro ao criar ventilador", erro: erro.sqlMessage });
        });
}

function listarModelos(req, res) {
    controleModel.listarModelos()
        .then(resultado => {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.status(204).send("Nenhum modelo encontrado!");
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar modelos: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}


function buscarVentilador(req, res) {
    const idVentilador = req.params.idVentilador;
    const idSala = req.params.idSala;

    controleModel.buscarVentilador(idVentilador, idSala)
        .then(resultado => {
            if (resultado.length > 0) {
                res.json(resultado[0]); // retorna um único ventilador
            } else {
                res.status(404).send("Ventilador não encontrado");
            }
        })
        .catch(erro => {
            console.error(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarVentilador(req, res) {
    const idVentilador = req.params.idVentilador;
    const { numero_serie, fk_modelo, fk_sala} = req.body;

    controleModel.atualizarVentilador(idVentilador, numero_serie, fk_modelo, fk_sala)
        .then(() => res.json({ message: "Ventilador atualizado com sucesso" }))
        .catch(erro => {
            console.error("Erro ao atualizar ventilador: ", erro.sqlMessage);
            res.status(500).json({ message: "Erro ao atualizar ventilador", erro: erro.sqlMessage });
        });
}


function listarEnderecos(req, res) {
    controleModel.listarEnderecos()
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err.sqlMessage));
}

function criarEndereco(req, res) {
    const endereco = req.body;
    controleModel.criarEndereco(endereco)
        .then(result => res.json({ message: "Endereço criado", id: result.insertId }))
        .catch(err => res.status(500).json(err.sqlMessage));
}

function criarHospital(req, res) {
    const hospital = req.body;
    controleModel.criarHospital(hospital)
        .then(result => res.json({ message: "Hospital criado", id: result.insertId }))
        .catch(err => res.status(500).json(err.sqlMessage));
}

async function buscarHospital(req, res) {
    const id = req.params.idHospital;
    controleModel.buscarHospital(id)
        .then(h => res.json(h[0]))
        .catch(err => res.status(500).json(err));
}

async function editarHospital(req, res) {
    const h = req.body;
    controleModel.editarHospital(h)
        .then(() => res.json({ message: 'Hospital atualizado' }))
        .catch(err => res.status(500).json(err));
}

async function deletarHospital(req, res) {
  try {
    const id = req.params.idHospital;
    await controleModel.deletarHospital(id);
    res.json({ message: "Hospital e ventiladores vinculados foram deletados" });
  } catch (err) {
    console.error("Erro ao deletar hospital:", err);
    res.status(500).json({ error: "Erro interno ao deletar hospital" });
  }
}

module.exports = {
    listarHospitais,
    listarVentiladores,
    deletarVentilador,
    criarVentilador,
    listarModelos,
    buscarVentilador,
    atualizarVentilador,
    listarEnderecos,
    criarEndereco,
    criarHospital,
    buscarHospital,
    editarHospital,
    deletarHospital
};


