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

module.exports={
    listarTodasMaquinas,
    deletarMaquina,
    // atualizarAcesso
}