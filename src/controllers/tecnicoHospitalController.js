var analistaModel = require("../models/tecnicoHospitalModel");

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




module.exports = {listarSemanal, listarMensal, listarAnual};