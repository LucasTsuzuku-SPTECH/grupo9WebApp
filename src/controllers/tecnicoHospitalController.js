var tecnicoHospitalModel = require("../models/tecnicoHospitalModel");

async function listarDiario(req, res) {
  try {
    const dadoDiario = await tecnicoHospitalModel.listarDiario();
    res.json(dadoDiario);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar dadoDiario");
  }
}

async function listarSemanal(req, res) {
  try {
    const dadoSemanal = await tecnicoHospitalModel.listarSemanal();
    res.json(dadoSemanal);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar dadoSemanal");
  }
}



async function listarMensal(req, res) {
  try {
    const dadoMensal = await tecnicoHospitalModel.listarMensal();
    res.json(dadoMensal);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar dadoMensal");
  }
}



async function listarAnual(req, res) {
  try {
    const dadoAnual = await tecnicoHospitalModel.listarAnual();
    res.json(dadoAnual);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar dadoAnual");
  }
}

function listarAreas(req, res) {
  const fk_hospital = req.params.fk_hospital;
    tecnicoHospitalModel.listarAreas(fk_hospital)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.status(204).send("Nenhuma área encontrada");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Erro ao buscar Salas: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}



module.exports = {listarDiario, listarSemanal, listarMensal, listarAnual, listarAreas};