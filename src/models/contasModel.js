var database = require("../database/config");

function listarTodasContas() {
    console.log("ACESSEI O CONTASMODEL");
    var instrucaoSql = `
   select *  from Usuario u
left join Hospital h 
on u.fk_hospital = h.id_hospital
where u.perfil != 'hospital';`
    return database.executar(instrucaoSql);
}


function listarHospitalContas(fk_hospital) {
    console.log("ACESSEI O CONTASMODEL");
    var instrucaoSql = `
        select *  
        from Usuario u
        left join Hospital h on u.fk_hospital = h.id_hospital
        where u.perfil = 'hospital' and u.fk_hospital = ${fk_hospital};
    `;
    return database.executar(instrucaoSql);
}


function deletarConta(id) {
    console.log("entrei no contasmodel");
    var instrucaoSql = `
    delete from Usuario where id_usuario = ${id}
    `
    return database.executar(instrucaoSql);

}

function atualizarAcesso(id, novoStatus) {
    console.log(`ALTERANDO STATUS DO USUÁRIO ${id} PARA ${novoStatus}`);
    var instrucaoSql = `
        UPDATE Usuario
        SET statusUser = '${novoStatus}'
        WHERE id_usuario = ${id};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    listarTodasContas,
    listarHospitalContas,
    deletarConta,
    atualizarAcesso
}