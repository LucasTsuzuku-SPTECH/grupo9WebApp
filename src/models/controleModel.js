var database = require("../database/config");

function listarHospitais() {
    console.log("ACESSEI controleModel listarHospitais()");

    // Pegando nome e status do hospital (se você quiser calcular alertas, pode alterar depois)
    var instrucaoSql = `
        SELECT idHospital, nomeHospital, idSala
        FROM Hospital
        JOIN Sala ON fkHospital = idHospital;
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarVentiladores(idSala) {
    console.log("ACESSEI controleModel listarVentiladores()");

    const instrucaoSql = `
        SELECT v.idVentilador, v.numero_serie, m.nome AS nome_modelo, m.descricao AS descricao_modelo,
               h.nomeHospital AS nome_hospital, h.idHospital as idHospital, 
               s.numero AS numero_sala, s.andar AS andar_sala, idSala
        FROM Ventilador v
        JOIN Modelo m ON v.fkModelo = m.idModelo
        JOIN Sala s ON v.fkSala = s.idSala
        JOIN Hospital h ON s.fkHospital = h.idHospital
        WHERE v.fkSala = ${idSala};
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarVentilador(idVentilador) {
    console.log("ACESSEI controleModel deletarVentilador()");
    const instrucaoSql = `DELETE FROM Ventilador WHERE idVentilador = ${idVentilador};`;
    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function criarVentilador(ventilador) {
    console.log("ACESSEI controleModel criarVentilador()");
    const { numero_serie, fk_modelo, fk_sala, fk_empresa } = ventilador;

    const instrucaoSql = `
        INSERT INTO Ventilador (numero_serie, fkModelo, fkSala, fkEmpresa)
        VALUES ('${numero_serie}', ${fk_modelo}, ${fk_sala}, ${fk_empresa});
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarModelos() {
    console.log("ACESSEI controleModel listarModelos()");
    const instrucaoSql = `
        SELECT idModelo, nome, descricao
        FROM Modelo;
    `;
    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarVentilador(idVentilador, idSala) {
    const sql = `
    SELECT v.idVentilador,
           v.numero_serie,
           v.fkModelo,
           v.fkSala
    FROM Ventilador v
    JOIN Sala s ON v.fkSala = s.idSala
    WHERE v.fkSala = ${idSala}
    and v.idVentilador = ${idVentilador};
  `;
    return database.executar(sql);
}

function atualizarVentilador(idVentilador, numero_serie, fk_modelo, fk_sala) {
    console.log("ACESSEI controleModel atualizarVentilador()");
    const instrucaoSql = `
        UPDATE Ventilador 
        SET numero_serie = '${numero_serie}', 
            fkModelo = ${fk_modelo},
            fkSala = ${fk_sala}
        WHERE idVentilador = ${idVentilador};
    `;
    return database.executar(instrucaoSql);
}

function listarEnderecos() {
    const sql = `SELECT * FROM Endereco;`;
    return database.executar(sql);
}

function criarEndereco(e) {
    const sql = `
        INSERT INTO Endereco (logradouro, numero, bairro, cidade, estado, cep)
        VALUES ('${e.logradouro}', '${e.numero || ""}', '${e.bairro || ""}', '${e.cidade}', '${e.estado}', '${e.cep || ""}');
    `;
    return database.executar(sql);
}

function criarHospital(h) {
    const sql = `
        INSERT INTO Hospital (nomeHospital, cnpj, fkEndereco, fkEmpresa)
        VALUES ('${h.nomeHospital}', '${h.cnpj}', ${h.fk_endereco}, ${h.fk_empresa});
    `;
    return database.executar(sql);
}

function buscarHospital(id) {
    const sql = `
    SELECT * FROM Hospital WHERE idHospital=${id};
    `;
    return database.executar(sql);
}

function editarHospital(hospital) {
    const {id_hospital, nomeHospital, cnpj, fk_endereco} = hospital;
    const sql = `
        UPDATE Hospital
        SET nomeHospital='${nomeHospital}', cnpj='${cnpj}', fkEndereco=${fk_endereco}
        WHERE idHospital=${id_hospital};
    `;
    return database.executar(sql);
}

async function deletarHospital(id) {
  // primeiro apaga os ventiladores vinculados
  const sqlVentiladores = `DELETE FROM Ventilador WHERE fkHospital = ${id}`;
  await database.executar(sqlVentiladores);

  // depois apaga os usuários vinculados (se fizer sentido na sua regra)
  const sqlUsuarios = `DELETE FROM Usuario WHERE fkHospital = ${id}`;
  await database.executar(sqlUsuarios);

  // por fim, apaga o hospital
  const sqlHospital = `DELETE FROM Hospital WHERE idHospital = ${id}`;
  return database.executar(sqlHospital);
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




