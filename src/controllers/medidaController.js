var medidaModel = require("../models/medidaModel");

// Função principal: Cruza dados do S3 (CSV) com MySQL
function buscarMonitoramento(req, res) {
    
    // Recupera o ID que veio na URL da rota
    var idHospital = req.params.idHospital;

    if (idHospital == undefined) {
        res.status(400).send("O idHospital está undefined!");
        return;
    }

    Promise.all([
        medidaModel.buscarMonitoramentoS3(),              // O CSV
        medidaModel.buscarVentiladoresEParametros(idHospital) // O Banco (passando o ID)
    ])
    .then(function (resultados) {
        const textoCsv = resultados[0];
        const listaDoBanco = resultados[1];

        // 1. Transforma o CSV em uma lista de objetos JSON
        const linhas = textoCsv.split('\n');
        const cabecalho = linhas[0].trim().split(',').map(col => col.trim());
        
        const listaCsv = [];
        for (let i = 1; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (linha) {
                const colunas = linha.split(',');
                let item = {};
                for (let j = 0; j < cabecalho.length; j++) {
                    let valor = colunas[j] ? colunas[j].replace(/"/g, '').trim() : null;
                    item[cabecalho[j]] = valor;
                }
                listaCsv.push(item);
            }
        }

        // 2. Organiza os dados do banco para facilitar a busca
        let mapaDeAreas = {};
        let mapaDeParametros = {}; 
        
        listaDoBanco.forEach(function (registro) {
            const id = registro.idVentilador;

            if (!mapaDeAreas[registro.nome_area]) {
                mapaDeAreas[registro.nome_area] = {
                    nome: registro.nome_area,
                    total: 0,       
                    estaveis: 0,
                    alertas: 0,
                    listaIds: new Set() 
                };
            }

            if (!mapaDeParametros[id]) {
                mapaDeParametros[id] = [];
            }
            
            if (registro.nomeComponente) {
                mapaDeParametros[id].push({
                    componente: registro.nomeComponente, 
                    max: registro.parametroMax,
                    min: registro.parametroMin
                });
            }
            
            mapaDeAreas[registro.nome_area].listaIds.add(id);
        });

        // 3. Verifica alerta por alerta
        for (let nomeArea in mapaDeAreas) {
            let area = mapaDeAreas[nomeArea];
            
            area.listaIds.forEach(function (idVentilador) { 
                area.total++; 

                // Procura no CSV
                const leitura = listaCsv.find(item => item.ID == idVentilador); 
                let temAlerta = false;

                if (leitura) {
                    const limites = mapaDeParametros[idVentilador] || [];
                    
                    for (let i = 0; i < limites.length; i++) {
                        let limite = limites[i];
                        let chave = Object.keys(leitura).find(k => k.toUpperCase() === limite.componente.toUpperCase());
                        
                        if (chave) {
                            let valorMedido = parseFloat(leitura[chave]);
                            
                            if (!isNaN(valorMedido) && (valorMedido > limite.max || valorMedido < limite.min)) {
                                temAlerta = true;
                                break; 
                            }
                        }
                    }
                }

                if (temAlerta) {
                    area.alertas++;
                } else {
                    area.estaveis++;
                }
            });
        }

        // 4. Cria a resposta final
        let respostaFinal = Object.values(mapaDeAreas).map(function (area) {
            
            let risco = area.total > 0 ? Math.round((area.alertas / area.total) * 100) : 0;
            let precisaReceber = 0;
            let podeDoar = 0;

            if (risco > 10) {
                precisaReceber = Math.ceil(area.alertas / 2); 
            } else {
                let minimoParaManter = Math.ceil(area.total * 0.60);
                let sobra = area.estaveis - minimoParaManter;
                
                if (sobra > 0) {
                    podeDoar = sobra;
                }
            }

            return {
                nome: area.nome,
                total: area.total,
                estaveis: area.estaveis,
                alertas: area.alertas,
                risco: risco,
                precisa: precisaReceber,
                podeEnviar: podeDoar
            };
        });

        respostaFinal.sort(function (a, b) {
            return b.risco - a.risco;
        });

        res.json(respostaFinal);

    }).catch(function (erro) {
        console.log("Erro no monitoramento:", erro);
        res.status(500).json({ error: erro.message });
    });
}

// Lógica de Umidade (Não muda, pois não depende do hospital)
function buscarUmidade(req, res) {
    medidaModel.buscarUmidadeS3()
    .then(function (resultado) {
        // ... (mesmo código anterior de umidade) ...
        // Vou abreviar aqui para não ficar gigante, mas mantenha o código que já estava funcionando
        if (resultado && resultado.length > 0) {
            let labels = [], dados = [], cores = [];
            let maiorValor = -1, indicePico = -1;
            const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
            const mesesCompletos = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

            resultado.sort((a, b) => (a.mes > b.mes) ? 1 : -1);

            for (let i = 0; i < resultado.length; i++) {
                let item = resultado[i];
                let mesNum = parseInt(item.mes.split('/')[1]) - 1; 
                labels.push(meses[mesNum]);
                let valor = item.umidadeMedia; 
                dados.push(valor);
                if (valor > maiorValor) { maiorValor = valor; indicePico = i; }
            }
            for (let i = 0; i < resultado.length; i++) { if (i === indicePico) cores.push('#e60e3a'); else cores.push('#30a799'); }
            if (indicePico === -1) indicePico = 0; 

            let objetoPico = resultado[indicePico];
            let numeroMesPico = parseInt(objetoPico.mes.split('/')[1]) - 1; 
            let previsao1 = (numeroMesPico + 3) % 12;
            let previsao2 = (numeroMesPico + 4) % 12;
            let hoje = new Date();
            let mesAtual = hoje.getMonth(); 
            let nivelRisco = "Baixo";
            let estiloCss = "seguro"; 
            
            if (mesAtual === previsao1 || mesAtual === previsao2) { nivelRisco = "Alto"; estiloCss = "perigo"; } 
            else if (mesAtual === (numeroMesPico + 2) % 12 || mesAtual === (numeroMesPico + 5) % 12) { nivelRisco = "Médio"; estiloCss = "alerta"; }

            res.status(200).json({
                grafico: { labels: labels, data: dados, colors: cores },
                kpi: { mesPico: meses[numeroMesPico], mesesPrevisao: `${meses[previsao1]} e ${meses[previsao2]}` },
                analiseRisco: { picoHistorico: mesesCompletos[numeroMesPico], nivelRisco: nivelRisco, periodoDemanda: `${mesesCompletos[previsao1]}/${mesesCompletos[previsao2]}`, classeCss: estiloCss }
            });
        } else { res.status(204).send("Nada encontrado"); }
    }).catch(function(erro) { console.log(erro); res.status(500).json(erro.message); });
}

module.exports = {
    buscarUmidade,
    buscarMonitoramento
}