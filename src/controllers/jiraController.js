
    const emailJira="zephyrus2g@gmail.com"
    const tokenJira="ATATT3xFfGF0R_padnKDM-eLEIRBYjxADAqp4CBbJn1XFSYIblyXvfjrMfpyESm93HElKwcZ6ntQWCTzM_bHogbJczReiSC8zhbIvYp7qRXpozMXj35wrMjNOVyTypVeIwUuXOVEbjdXAeDp77W8KgqKHq0pXQvDIz5xvsnD9FzQfBLYpjdV3As=7162A9A8";
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
            fields:["summary","duedate","status","assignee","created","priority","customfield_10091","customfield_10092","resolutiondate"],
      
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