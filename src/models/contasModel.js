var database = require("../database/config");

function listarTodasContas(){
    console.log("ACESSEI O CONTASMODEL");
    var instrucaoSql=`
   select *  from Usuario u
left join Hospital h 
on u.fk_hospital = h.id_hospital;`
    return database.executar(instrucaoSql); 
}



function deletarConta(id){
    console.log("entrei no contasmodel");
    var instrucaoSql=`
    delete from Usuario where id_usuario = ${id}
    `
    return database.executar(instrucaoSql);

}
module.exports={
    listarTodasContas,
    deletarConta
}