var database = require("../database/config");

function listarTodasMaquinas(){
    console.log("ACESSEI O MAQUINASMODEL");
    var instrucaoSql=`
   select *  from Ventilador v
left join Hospital h 
on v.fk_hospital = h.id_hospital
where fk_hospital = 1;`
    return database.executar(instrucaoSql); 
}

function vincularHospital(id){
    var instrucaoSql=`
    select h.nome from Hospital h
    inner join Usuario u on u.fk_hospital = h.id_hospital
    where u.fk_empresa = ${id} limit 1;`
    return database.executar(instrucaoSql);
}


function deletarMaquina(id){
    console.log("entrei no maquinasmodel");
    var instrucaoSql=`
    delete from Ventilador where id_ventilador = ${id}
    `
    return database.executar(instrucaoSql);
}

// function atualizarAcesso(id, novoStatus) {
//     console.log(`ALTERANDO STATUS DO USUÁRIO ${id} PARA ${novoStatus}`);
//     var instrucaoSql = `
//         UPDATE Usuario
//         SET statusUser = '${novoStatus}'
//         WHERE id_usuario = ${id};
//     `;
//     return database.executar(instrucaoSql);
// }

function cadastrar(modelo, serie, sala, andar, fk_empresa, fk_hospital){
    var instrucaoSql=`
    insert into Ventilador (numero_serie, fk_modelo, sala, andar, fk_hospital, fk_empresa) values
('${serie}', '${modelo}', ${sala}, ${andar}, ${fk_hospital}, ${fk_empresa});
    `
    return database.executar(instrucaoSql);
}

module.exports={
    listarTodasMaquinas,
    deletarMaquina,
    vincularHospital,
    cadastrar,
    // atualizarAcesso
}