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
    const idHospital = req.params.idHospital;
    controleModel.listarVentiladores(idHospital)
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

function criarVentilador(req, res){
    const ventilador = req.body; // { numero_serie, fk_modelo, fk_hospital, fk_empresa }

    controleModel.criarVentilador(ventilador)
        .then(() => res.json({message: "Ventilador criado com sucesso"}))
        .catch(erro => {
            console.error("Erro ao criar ventilador: ", erro.sqlMessage || erro);
            res.status(500).json({message: "Erro ao criar ventilador", erro: erro.sqlMessage});
        });
}



module.exports = {
    listarHospitais,
    listarVentiladores,
    deletarVentilador,
    criarVentilador
};

