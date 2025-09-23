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

function editarUsuario(id, nome, email, perfil){
  const query = `
    UPDATE Usuario
    SET nome = '${nome}', email = '${email}', perfil = '${perfil}'
    WHERE id_usuario = ${id};
  `;
  return database.executar(query);
};

module.exports = {
    listarHospitais,
    editarUsuario
};
