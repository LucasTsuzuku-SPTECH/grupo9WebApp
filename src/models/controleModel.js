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

function listarModelos() {
    console.log("ACESSEI controleModel listarModelos()");
    const instrucaoSql = `
        SELECT id_modelo, nome, descricao
        FROM Modelo;
    `;
    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarVentilador(idVentilador) {
    const sql = `
    SELECT v.id_ventilador,
           v.numero_serie,
           v.fk_modelo,
           v.fk_hospital
    FROM Ventilador v
    WHERE v.id_ventilador = ${idVentilador};
  `;
    return database.executar(sql);
}

function atualizarVentilador(idVentilador, numero_serie, fk_modelo, fk_hospital) {
    console.log("ACESSEI controleModel atualizarVentilador()");
    const instrucaoSql = `
        UPDATE Ventilador 
        SET numero_serie = '${numero_serie}', 
            fk_modelo = ${fk_modelo},
            fk_hospital = ${fk_hospital}
        WHERE id_ventilador = ${idVentilador};
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
        INSERT INTO Hospital (nomeHospital, cnpj, fk_endereco, fk_empresa)
        VALUES ('${h.nomeHospital}', '${h.cnpj}', ${h.fk_endereco}, ${h.fk_empresa});
    `;
    return database.executar(sql);
}

function buscarHospital(id) {
    const sql = `
    SELECT * FROM Hospital WHERE id_hospital=${id};
    `;
    return database.executar(sql);
}

function editarHospital(hospital) {
    const {id_hospital, nomeHospital, cnpj, fk_endereco} = hospital;
    const sql = `
        UPDATE Hospital
        SET nomeHospital='${nomeHospital}', cnpj='${cnpj}', fk_endereco=${fk_endereco}
        WHERE id_hospital=${id_hospital};
    `;
    return database.executar(sql);
}

async function deletarHospital(id) {
  // primeiro apaga os ventiladores vinculados
  const sqlVentiladores = `DELETE FROM Ventilador WHERE fk_hospital = ${id}`;
  await database.executar(sqlVentiladores);

  // depois apaga os usuários vinculados (se fizer sentido na sua regra)
  const sqlUsuarios = `DELETE FROM Usuario WHERE fk_hospital = ${id}`;
  await database.executar(sqlUsuarios);

  // por fim, apaga o hospital
  const sqlHospital = `DELETE FROM Hospital WHERE id_hospital = ${id}`;
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




