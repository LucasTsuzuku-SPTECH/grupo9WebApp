// Função para chamar a API do Jira
    const emailJira="zephyrus2g@gmail.com"
    const tokenJira="";
    const dominioJira="zephyrus2g1.atlassian.net";
    const auth=btoa(`${emailJira}:${tokenJira}`)
    async function jira(method, url, body) {
  const resposta = await fetch(`https://zephyrus2g1.atlassian.net${url}`, {
    method,
    headers: {
      "Authorization": `Basic ATATT3xFfGF0IAJRaDwwv65Fo2d5GZIoARbH61t4HGpyfCWYgtXjjn0_NRmyKydDYwc66Af4HpUJwOh2zwbQXFgQsULsvjhfrPUcdZTmD7cCeSUv6LY7Ea0FZp6Ur8NCJnmy8Il2rAlG5KY49uFIgDeoOS8-wizvqYskxl4-_BvFXvcmnlG5Xcc=E5FF409F`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  return resposta.json();
}
async function existeChamadoInterno(numero, componente) {
  try {
    const resposta = await fetch(`https://${dominioJira}/rest/api/3/search/jql`,{
        method:"POST",
        headers:{
            "Authorization":`Basic ${auth}`,
            "Accept":"application/json",
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            jql:`project = "Chamados zephyrus" 
                  AND "Maquina[Short text]" ~ "${numero}"
                  AND "Componente[Short text]" ~ "${componente}"`,
            maxResults:100,
            fields:["summary","duedate","status","assignee","created","priority","customfield_10091","customfield_10092","resolutiondate"],
      
        })
    });
    const dados=await resposta.json();
    console.log(dados);
    return dados.issues.length > 0;
    }catch(erro){
        console.error("Erro ao buscar chamados do Jira:", erro);
        res.status(500).json({ error: "Erro ao buscar chamados do Jira" });
    }
}


async function criarChamadoInterno(issue) {
  try {
    const resposta = await fetch(`https://${dominioJira}/rest/api/3/issue`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(issue)
    });

    if (!resposta.ok) {
      const txt = await resposta.text();
      console.error("Erro Jira (status):", resposta.status, txt);
      throw new Error(`Jira API error ${resposta.status}`);
    }

    const contentType = resposta.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const txt = await resposta.text();
      console.error("Resposta Jira não é JSON:", txt);
      throw new Error("Resposta Jira não é JSON");
    }

    const dados = await resposta.json();
    return dados.key;
  } catch (erro) {
    console.error("Erro ao criar chamado interno:", erro);
    return null;
  }
}

module.exports = { jira, existeChamadoInterno, criarChamadoInterno };

