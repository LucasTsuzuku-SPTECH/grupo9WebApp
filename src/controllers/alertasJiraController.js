    var alertasJiraModel = require("../models/alertasJiraModel");

 
 function buscarAlertasJira(req, res) {
      Promise.all([
            alertasJiraModel.buscarChamadosS3(),
        ]) .then(function (resultados) {
            const textoCsv = resultados[0];
                        const linhas = textoCsv.split('\n');
            const cabecalho = linhas[0].trim().split(',').map(col => col.trim());
            const listaCsv = [];
            for (let i = 1; i < linhas.length; i++) {
                const linha = linhas[i].trim();
                if (linha) {
                    const colunas = linha.split(',');
                    let item = {};
                    for (let j = 0; j < cabecalho.length; j++) item[cabecalho[j]] = colunas[j] ? colunas[j].replace(/"/g, '').trim() : null;
                    listaCsv.push(item);
                }
            }
            res.status(200).json(listaCsv);})
    // Lógica para buscar alertas do Jira
    .catch(function (erro) {
        console.log(erro);
        console.log(
            "Houve um erro ao buscar os alertas do Jira! Erro: ",
            erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage);
    });
}   
module.exports = {
    buscarAlertasJira
};