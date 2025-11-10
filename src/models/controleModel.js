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

function HospitalUsuario(fkHospital) {

    console.log("ACESSEI controleModel HospitalUsuario()");
    var instrucaoSql = `
        SELECT nomeHospital
        FROM Hospital where idHospital = ${fkHospital};
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);

};

function listarSalas() {
    console.log("ACESSEI controleModel listarSalas()");

    // Pegando nome e status do hospital (se você quiser calcular alertas, pode alterar depois)
    var instrucaoSql = `
        SELECT h.idHospital, h.nomeHospital, s.idSala
        FROM Hospital h
        INNER JOIN Sala s ON s.fkHospital = h.idHospital;
    `;

    console.log("Executando SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarSala(idHospital) {
    console.log("ACESSEI controleModel listarSala()");

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
    const { numero_serie, nomeModelo, fk_sala } = ventilador;
    const sql = `
        INSERT INTO Ventilador (numero_serie, fkModelo, fkSala)
        VALUES ('${numero_serie}', (SELECT idModelo FROM Modelo WHERE nome LIKE "${nomeModelo}"), ${fk_sala});
    `;
    return database.executar(sql);
}

function criarModelo(ventilador) {
    const [nomeModelo, fk_empresa] = ventilador;
    const sql = `
        INSERT INTO Modelo (nome, fkEmpresa)
        VALUES ('${nomeModelo}', ${fk_empresa});
    `;
    return database.executar(sql);
}

async function criarParametro(componente) {
    const sql = `
    INSERT INTO Parametro (fkComponente, fkVentilador, parametroMax, parametroMin)
    VALUES (${componente.idComponente},  (SELECT idVentilador FROM Ventilador WHERE numero_serie LIKE "${componente.numero_serie}"), ${componente.parametroMax}, ${componente.parametroMin});
    `;
    return database.executar(sql);
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

function atualizarVentilador(id_ventilador, fk_sala) {
    console.log("ACESSEI controleModel atualizarVentilador()");
    const instrucaoSql = `
        UPDATE Ventilador 
        SET fkSala = ${fk_sala}
        WHERE idVentilador = ${id_ventilador};
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
    const { id_hospital, nomeHospital, cnpj, fk_endereco } = hospital;
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

// Atualizar parametro existente
function atualizarParametro(idParametro, min, max) {
    const sqlParam = `
        UPDATE Parametro
        SET parametroMin = ${min}, parametroMax = ${max}
        WHERE idParametro = ${idParametro};
    `;
    return database.executar(sqlParam);
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



module.exports = {
    listarHospitais,
    HospitalUsuario,
    listarSalas,
    listarVentiladores,
    deletarVentilador,
    criarVentilador,
    criarModelo,
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
    buscarComponentesPorVentilador,
    atualizarParametro,
    criarParametro,
    deletarParametro,
    deletarComponente,
    listarVentiladoresSala,
    listarSala
}




