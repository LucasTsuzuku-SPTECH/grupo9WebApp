var database = require("../database/config");

function listarHospitais() {
    console.log("ACESSEI controleModel listarHospitais()");

    // Pegando nome e status do hospital (se você quiser calcular alertas, pode alterar depois)
    var instrucaoSql = `
        SELECT idHospital, nomeHospital
        FROM Hospital;
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarSalas() {
    console.log("ACESSEI controleModel listarSalas()");

    // Pegando nome e status do hospital (se você quiser calcular alertas, pode alterar depois)
    var instrucaoSql = `
        SELECT idHospital, nomeHospital, idSala
        FROM Hospital
        INNER JOIN Sala ON fkHospital = idHospital;
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarSala(idHospital) {
    console.log("ACESSEI controleModel listarSalas()");

    // Pegando nome e status do hospital (se você quiser calcular alertas, pode alterar depois)
    var instrucaoSql = `
        SELECT * FROM Sala
        WHERE fkHospital = ${idHospital};
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarVentiladores(idHospital) {
    console.log("ACESSEI controleModel listarVentiladores()");

    const instrucaoSql = `
        SELECT v.idVentilador, v.numero_serie, m.nome AS nome_modelo,
               h.nomeHospital AS nome_hospital, h.idHospital as idHospital, 
                s.idSala as idSala, s.area as area
        FROM Ventilador v
        JOIN Modelo m ON v.fkModelo = m.idModelo
        JOIN Sala s ON v.fkSala = s.idSala
        JOIN Hospital h ON s.fkHospital = h.idHospital
        WHERE h.idHospital = ${idHospital}
        ORDER BY idSala;  
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function listarVentiladoresSala(idSala) {
    console.log("ACESSEI controleModel listarVentiladoresSala()");

    const instrucaoSql = `
        SELECT v.idVentilador, v.numero_serie, m.nome AS nome_modelo,
               s.numero AS numero_sala, s.area, s.idSala as idSala
        FROM Ventilador v
        JOIN Modelo m ON v.fkModelo = m.idModelo
        JOIN Sala s ON v.fkSala = s.idSala
        WHERE s.idSala = ${idSala}
        ORDER BY idSala; 
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function deletarVentilador(idVentilador) {
    console.log("ACESSEI controleModel deletarVentilador()");
    
    const sql1 = `DELETE FROM Parametro WHERE fkVentilador = ${idVentilador};`;
    const sql2 = `DELETE FROM Ventilador WHERE idVentilador = ${idVentilador};`;

    console.log("Executando SQL:\n" + sql1 + "\n" + sql2);

    await database.executar(sql1);
    return database.executar(sql2);
}

async function criarVentilador(ventilador) {
    const { numero_serie, fk_modelo, fk_sala, fk_empresa } = ventilador;
    const sql = `
        INSERT INTO Ventilador (numero_serie, fkModelo, fkSala, fkEmpresa)
        VALUES ('${numero_serie}', ${fk_modelo}, ${fk_sala}, ${fk_empresa});
    `;
    const result = await database.executar(sql);
    return result.insertId; // pega o idVentilador recém criado
}

async function criarComponenteEParametro(componente, fkVentilador) {
    const sqlComp = `
        INSERT INTO Componente (nomeComponente, unidadeMedida)
        VALUES ('${componente.nome}', '${componente.unidade}');
    `;
    const result = await database.executar(sqlComp);
    const idComponente = result.insertId;

    const sqlParam = `
        INSERT INTO Parametro (parametroMin, parametroMax, fkVentilador, fkComponente)
        VALUES (${componente.parametroMin}, ${componente.parametroMax}, ${fkVentilador}, ${idComponente});
    `;
    return database.executar(sqlParam);
}


function listarModelos() {
    console.log("ACESSEI controleModel listarModelos()");
    const instrucaoSql = `
        SELECT idModelo, nome, fkEmpresa
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
    console.log("entrei no model")
    const sql = `
        INSERT INTO Hospital (nomeHospital, cnpj, fkEndereco)
        VALUES ('${h.nomeHospital}', '${h.cnpj}', ${h.fk_endereco});
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

function listarParametros(idVentilador) {
    console.log("ACESSEI controleModel listarParametros()");

    const instrucaoSql = `
        SELECT c.nomeComponente, c.unidadeMedida, p.parametroMin, p.parametroMax
        FROM Parametro p
        JOIN Componente c ON p.fkComponente = c.idComponente
        WHERE p.fkVentilador = ${idVentilador};
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Buscar componentes de um ventilador
function buscarComponentesPorVentilador(idVentilador) {
    const sql = `
        SELECT c.idComponente, c.nomeComponente, c.unidadeMedida,
               p.idParametro, p.parametroMin, p.parametroMax
        FROM Componente c
        JOIN Parametro p ON c.idComponente = p.fkComponente
        WHERE p.fkVentilador = ${idVentilador};
    `;
    return database.executar(sql);
}

// Atualizar componente existente
function atualizarComponenteEParametro(idComponente, nome, unidade, idParametro, min, max) {
    const sqlComp = `
        UPDATE Componente
        SET nomeComponente = '${nome}', unidadeMedida = '${unidade}'
        WHERE idComponente = ${idComponente};
    `;
    const sqlParam = `
        UPDATE Parametro
        SET parametroMin = ${min}, parametroMax = ${max}
        WHERE idParametro = ${idParametro};
    `;
    return database.executar(sqlComp).then(() => database.executar(sqlParam));
}

function criarComponente(nomeComponente, unidadeMedida) {
    const sql = `
        INSERT INTO Componente (nomeComponente, unidadeMedida) 
        VALUES ('${nomeComponente}', '${unidadeMedida}');
    `;
    console.log("Executando SQL:\n" + sql);
    return database.executar(sql);
}

function criarParametro(parametroMin, parametroMax, fkVentilador, fkComponente) {
    const sql = `
        INSERT INTO Parametro (parametroMin, parametroMax, fkVentilador, fkComponente) 
        VALUES (${parametroMin}, ${parametroMax}, ${fkVentilador}, ${fkComponente});
    `;
    console.log("Executando SQL:\n" + sql);
    return database.executar(sql);
}

function deletarParametro(idParametro) {
    const sql = `
        DELETE FROM Parametro WHERE idParametro = ${idParametro};
    `;
    console.log("Executando SQL:\n" + sql);
    return database.executar(sql);
}

function deletarComponente(idComponente) {
    const sql = `
        DELETE FROM Componente WHERE idComponente = ${idComponente};
    `;
    console.log("Executando SQL:\n" + sql);
    return database.executar(sql);
}

async function criarSala(sala) {
    const { andar, numero, descricao, fkHospital } = sala;

    const sql = `
        INSERT INTO Sala (andar, numero, descricao, fkHospital)
        VALUES (${andar}, '${numero}', '${descricao}', ${fkHospital});
    `;

    const result = await database.executar(sql);
    return result.insertId;
}

module.exports = {
    listarHospitais,
    listarSalas,
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
    deletarHospital,
    listarParametros,
    criarComponenteEParametro,
    buscarComponentesPorVentilador,
    atualizarComponenteEParametro,
    criarComponente,
    criarParametro,
    deletarParametro,
    deletarComponente,
    criarSala,
    listarVentiladoresSala,
    listarSala
}




