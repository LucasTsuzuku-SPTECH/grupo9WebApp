
    const emailJira="zephyrus2g@gmail.com"
    const tokenJira="ATATT3xFfGF05iWRDCXKhXZYF3yapED-KyRdzr9O-ZTQuM-cAn0_i_LDjiHqJCa6k_XEGkcsrsiRaYLWY5FBP5DcgGyZPMC-RDocHaKZ31N3IhAr-QHnwvdFfoJ7TUTDshD-3DC_3f7aVwUoqWSXSHElna4JT9Hk-NDohn6FFyi8lqwAYl42ZEY=6045C37E";
    const dominioJira="zephyrus2g1.atlassian.net";
    const auth=btoa(`${emailJira}:${tokenJira}`)

async function buscarChamadosJira(req, res) {
    
    try{// Lógica para buscar chamados do Jira
    const resposta=await fetch(`https://${dominioJira}/rest/api/3/search/jql`,{
        method:"POST",
        headers:{
            "Authorization":`Basic ${auth}`,
            "Accept":"application/json",
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            jql:"project='Chamados zephyrus'",
            maxResults:100,
            fields:["summary","status","assignee","created","priority","customfield_10091","customfield_10092"]
        })
    });
    const dados=await resposta.json();
    res.status(200).json(dados);
    }catch(erro){
        console.error("Erro ao buscar chamados do Jira:", erro);
        res.status(500).json({ error: "Erro ao buscar chamados do Jira" });
    }
}
module.exports = {
    buscarChamadosJira
};