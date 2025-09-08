var database = require("../database/config")

function autenticar(email, senha) {

    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT * FROM Usuario WHERE email = '${email}' AND senha_hash = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
    }

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, senha, perfil, fk_empresa, fk_hospital) {
    var instrucaoSql = `
        INSERT INTO Usuario (nome, email, senha_hash, perfil, fk_empresa, fk_hospital, statusUser) 
        VALUES ('${nome}', '${email}', '${senha}','${perfil}', ${fk_empresa}, ${fk_hospital}, 'ativo');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha, perfil, fk_empresa, fk_hospital) {
    var instrucaoSql = `
        INSERT INTO Usuario (nome, email, senha_hash, perfil, fk_empresa, fk_hospital, statusUser) 
        VALUES ('${nome}', '${email}', '${senha}','hospital', ${fk_empresa}, ${fk_hospital}, 'ativo');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listar(){
    const instrucao = "SELECT id_hospital, nomeHospital FROM Hospital;";
    return database.executar(instrucao);
}

module.exports = {
    autenticar,
    cadastrar,
    listar
};