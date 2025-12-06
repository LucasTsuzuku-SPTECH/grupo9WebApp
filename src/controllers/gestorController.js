var gestorModel = require("../models/gestorModel");

async function listarSemanal(req, res) {
  try {
    const dadoSemanal = await analistaModel.listarSemanal();
    res.json(dadoSemanal);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar dadoSemanal");
  }
}



async function listarMensal(req, res) {
  try {
    const dadoMensal = await analistaModel.listarMensal();
    res.json(dadoMensal);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar dadoMensal");
  }
}


listarModelos
async function listarAnual(req, res) {
  try {
    const dadoAnual = await analistaModel.listarAnual();
    res.json(dadoAnual);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar dadoAnual");
  }
}

async function listarDiario(req, res) {
  try {
    const dadoAnual = await analistaModel.listarDiario();
    res.json(dadoAnual);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erro ao listar dadoDiario");
  }
}
















module.exports = {listarSemanal, listarMensal, listarAnual, listarDiario};