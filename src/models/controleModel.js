var database = require("../database/config");

function listarHospitais() {
    console.log("ACESSEI controleModel listarHospitais()");

    // Pegando nome e status do hospital (se você quiser calcular alertas, pode alterar depois)
    var instrucaoSql = `
        SELECT id_hospital, nomeHospital
        FROM Hospital;
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarVentiladores(idHospital) {
    console.log("ACESSEI controleModel listarVentiladores()");

    const instrucaoSql = `
        SELECT v.id_ventilador, v.numero_serie, m.nome AS nome_modelo, m.descricao AS descricao_modelo,
               h.nomeHospital AS nome_hospital, h.id_hospital as idHospital
        FROM Ventilador v
        JOIN Modelo m ON v.fk_modelo = m.id_modelo
        JOIN Hospital h ON v.fk_hospital = h.id_hospital
        WHERE v.fk_hospital = ${idHospital};
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarVentilador(idVentilador) {
    console.log("ACESSEI controleModel deletarVentilador()");
    const instrucaoSql = `DELETE FROM Ventilador WHERE id_ventilador = ${idVentilador};`;
    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function criarVentilador(ventilador) {
    console.log("ACESSEI controleModel criarVentilador()");
    const { numero_serie, fk_modelo, fk_hospital, fk_empresa } = ventilador;

    const instrucaoSql = `
        INSERT INTO Ventilador (numero_serie, fk_modelo, fk_hospital, fk_empresa)
        VALUES ('${numero_serie}', ${fk_modelo}, ${fk_hospital}, ${fk_empresa});
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarHospitais,
    listarVentiladores,
    deletarVentilador,
    criarVentilador
};



