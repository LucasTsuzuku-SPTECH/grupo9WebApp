var analistaModel = require("../models/analistaModel");

async function listarSemanal(req, res) {
  try {
    const dadoSemanal = await analistaModelModel.listarSemanal();
    res.json(dadoSemanal);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar dadoSemanal");
  }
}



async function listarMensal(req, res) {
  try {
    const dadoMensal = await analistaModelModel.listarMensal();
    res.json(dadoMensal);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar dadoMensal");
  }
}



async function listarAnual(req, res) {
  try {
    const dadoAnual = await analistaModelModel.listarAnual();
    res.json(dadoAnual);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar dadoAnual");
  }
}


async function listarModelos(req, res) {
    var idEmpresa = req.param.FK

  try {
    const dadoAnual = await analistaModelModel.listarModelos(idEmpresa);
    res.json(dadoAnual);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar dadoAnual");
  }
}










module.exports = {listarSemanal, listarMensal, listarAnual, listarModelos};