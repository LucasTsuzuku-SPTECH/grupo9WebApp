var medidaModel = require("../models/medidaModel");

function buscarMonitoramento(req, res) {

    var idHospital = req.params.idHospital;

    if (idHospital == undefined) {
        res.status(400).send("ID do Hospital indefinido");
        return;
    }

    Promise.all([
        medidaModel.buscarMonitoramentoS3(),
        medidaModel.buscarVentiladoresEParametros(idHospital)
    ])
        .then(function (resultados) {
            const textoCsv = resultados[0];
            const listaDoBanco = resultados[1];

            // 1. CSV para JSON
            const linhas = textoCsv.split('\n');
            const cabecalho = linhas[0].trim().split(',').map(col => col.trim());
            const listaCsv = [];
            for (let i = 1; i < linhas.length; i++) {
                const linha = linhas[i].trim();
                if (linha) {
                    const colunas = linha.split(',');
                    let item = {};
                    for (let j = 0; j < cabecalho.length; j++) item[cabecalho[j]] = colunas[j] ? colunas[j].replace(/"/g, '').trim() : null;
                    listaCsv.push(item);
                }
            }

            // 2. Agrupa Banco
            let mapaDeAreas = {};
            let mapaDeParametros = {};
            listaDoBanco.forEach(function (registro) {
                const id = registro.idVentilador;
                if (!mapaDeAreas[registro.nome_area]) {
                    mapaDeAreas[registro.nome_area] = {
                        nome: registro.nome_area,
                        total: 0, estaveis: 0, alertas: 0, listaIds: new Set()
                    };
                }
                if (!mapaDeParametros[id]) mapaDeParametros[id] = [];
                if (registro.nomeComponente) {
                    mapaDeParametros[id].push({ componente: registro.nomeComponente, max: registro.parametroMax, min: registro.parametroMin });
                }
                mapaDeAreas[registro.nome_area].listaIds.add(id);
            });

            // 3. Verifica Alertas
            for (let nomeArea in mapaDeAreas) {
                let area = mapaDeAreas[nomeArea];
                area.listaIds.forEach(function (idVentilador) {
                    area.total++;
                    const leitura = listaCsv.find(item => item.ID == idVentilador);
                    let temAlerta = false;
                    if (leitura) {
                        const limites = mapaDeParametros[idVentilador] || [];
                        for (let i = 0; i < limites.length; i++) {
                            let limite = limites[i];
                            let chave = Object.keys(leitura).find(k => k.toUpperCase() === limite.componente.toUpperCase());
                            if (chave) {
                                let valor = parseFloat(leitura[chave]);
                                if (!isNaN(valor) && (valor > limite.max || valor < limite.min)) { temAlerta = true; break; }
                            }
                        }
                    }
                    if (temAlerta) area.alertas++; else area.estaveis++;
                });
            }

            // 4. Lógica de Risco e Disponibilidade Inicial
            let listaAreas = Object.values(mapaDeAreas).map(function (area) {
                // Math.floor para garantir inteiros (truncate)
                let risco = area.total > 0 ? Math.floor((area.alertas / area.total) * 100) : 0;
                let estabilidade = area.total > 0 ? Math.floor((area.estaveis / area.total) * 100) : 0;

                let precisaReceber = 0;
                let podeDoar = 0;

                // Regra: Disponível se Estabilidade >= 90%. Cede 80% dos ESTÁVEIS (truncate).
                if (estabilidade >= 90) {
                    podeDoar = Math.floor(area.estaveis * 0.80);
                }
                // Regra: Necessita se Risco > 10%
                else if (risco > 10) {
                    precisaReceber = Math.ceil(area.alertas / 2); // Necessidade inicial é um chute, será limitada na distribuição
                }

                return {
                    nome: area.nome,
                    total: area.total,
                    estaveis: area.estaveis,
                    alertas: area.alertas,
                    risco: risco,
                    estabilidade: estabilidade,
                    precisaReceber: precisaReceber,
                    podeDoar: podeDoar,
                    origemDoacao: []
                };
            });

            // 5. Distribuição
            let doadores = listaAreas.filter(a => a.podeDoar > 0);
            let necessitados = listaAreas.filter(a => a.precisaReceber > 0);

            // Ordena quem doa mais primeiro para distribuir
            doadores.sort((a, b) => b.podeDoar - a.podeDoar);

            necessitados.forEach(function (receptor) {
                let falta = receptor.precisaReceber; // O quanto ela pediu inicialmente

                for (let i = 0; i < doadores.length; i++) {
                    let doador = doadores[i];

                    if (falta <= 0) break;
                    if (doador.podeDoar <= 0) continue;

                    // Quantidade real a ser movimentada (min entre o que falta e o que o doador tem)
                    let qtdPassada = Math.min(falta, doador.podeDoar);

                    doador.podeDoar -= qtdPassada; // Doador cede
                    falta -= qtdPassada; // Receptor recebe

                    receptor.origemDoacao.push({
                        nome: doador.nome,
                        qtd: qtdPassada
                    });
                }
            });

            // 6. Formatação Final (Com mensagens específicas e chaves do Front-end)
            let respostaFinal = listaAreas.map(function (area) {

                let status = "Estável";
                let mensagem = "Estabilidade adequada. Operação normal.";
                let valorAcao = 0;

                // Campos para compatibilidade com o Front-end original (usado para CSS)
                let valorPrecisaFront = 0;
                let valorPodeEnviarFront = 0;

                // Estado NECESSITA
                if (area.precisaReceber > 0 || area.origemDoacao.length > 0) {
                    status = "Necessita";
                    valorPrecisaFront = area.precisaReceber;

                    let totalRecebido = area.origemDoacao.reduce((acc, curr) => acc + curr.qtd, 0);
                    valorAcao = area.precisaReceber; // Mostra o que ela precisa no KPI

                    if (totalRecebido > 0) {
                        // Recebeu ajuda
                        let fontes = area.origemDoacao.map(o => `${o.qtd} unidades da ${o.nome}`).join(', ');

                        if (totalRecebido < area.precisaReceber) {
                            // Se recebeu menos do que pediu, fala o que falta
                            mensagem = `- Adicionar +${totalRecebido} unidades. Deve receber de: ${fontes}.<br>- Faltam ${area.precisaReceber - totalRecebido} unidades.`;
                        } else {
                            // Deve receber o suficiente
                            mensagem = `- Adicionar +${totalRecebido} unidades.<br>- Deve receber ${fontes}.`;
                        }
                    } else {
                        // Não recebeu nada
                        mensagem = `É necessário remanejar ${area.precisaReceber} unidades o quanto antes.`;
                    }

                } else {
                    // Recalcula o original (80% dos estáveis) antes da distribuição, para exibição correta de "Pode Ceder"
                    let doacaoOriginal = Math.floor(area.estaveis * 0.80);

                    if (doacaoOriginal > 0) {
                        // Estado DISPONÍVEL
                        status = "Disponível";
                        valorPodeEnviarFront = doacaoOriginal;
                        valorAcao = doacaoOriginal;

                        let valorSobrando = area.podeDoar;

                        if (valorSobrando < doacaoOriginal) {
                            // Foi doador
                            let qtdDoada = doacaoOriginal - valorSobrando;
                            mensagem = `- Enviar ${qtdDoada} unidades.<br>- Restam unidades ${valorSobrando} disponíveis.`;
                        } else {
                            // Não doou para ninguém
                            mensagem = `Pode enviar ${doacaoOriginal} unidades para apoiar áreas em estado crítico.`;
                        }

                    } else if (area.risco <= 10) {
                        status = "Estável";
                        mensagem = "Estabilidade adequada. Operação normal.";
                        valorAcao = 0;
                    }
                }


                return {
                    nome: area.nome,
                    total: area.total,
                    estaveis: area.estaveis,
                    alertas: area.alertas,
                    risco: area.risco,
                    estabilidade: area.estabilidade,

                    // Campos Visuais (mensagem de ação e valor principal)
                    status: status,
                    mensagemAcao: mensagem,
                    valorAcao: valorAcao,

                    // Campos de Controle Lógico (Compatibilidade com seu Script HTML)
                    precisa: valorPrecisaFront,
                    podeEnviar: valorPodeEnviarFront
                };
            });

            // Ordena por risco (área mais crítica primeiro)
            respostaFinal.sort((a, b) => b.risco - a.risco);
            res.json(respostaFinal);

        }).catch(function (erro) {
            console.log("Erro:", erro);
            res.status(500).json({ error: erro.message });
        });
}

function buscarUmidade(req, res) {
    medidaModel.buscarUmidadeS3().then(resultado => {
        if (resultado && resultado.length > 0) {
            let labels = [], dados = [], cores = [], maior = -1, pico = -1;
            const m = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
            const mf = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            resultado.sort((a, b) => (a.mes > b.mes) ? 1 : -1);
            for (let i = 0; i < resultado.length; i++) {
                let it = resultado[i]; let nm = parseInt(it.mes.split('/')[1]) - 1;
                labels.push(m[nm]); dados.push(it.umidadeMedia);
                if (it.umidadeMedia > maior) { maior = it.umidadeMedia; pico = i; }
            }
            for (let i = 0; i < dados.length; i++) cores.push(i === pico ? '#e60e3a' : '#30a799');
            if (pico === -1) pico = 0;
            let mp = parseInt(resultado[pico].mes.split('/')[1]) - 1;
            let p1 = (mp + 3) % 12, p2 = (mp + 4) % 12, hj = new Date().getMonth(), r = "Baixo", c = "seguro";
            if (hj === p1 || hj === p2) { r = "Alto"; c = "perigo"; } else if (hj === (mp + 2) % 12 || hj === (mp + 5) % 12) { r = "Médio"; c = "alerta"; }
            res.status(200).json({
                grafico: { labels: labels, data: dados, colors: cores },
                kpi: { mesPico: m[mp], mesesPrevisao: `${m[p1]} e ${m[p2]}` },
                analiseRisco: { picoHistorico: mf[mp], nivelRisco: r, periodoDemanda: `${mf[p1]}/${mf[p2]}`, classeCss: c }
            });
        } else res.status(204).send("Vazio");
    }).catch(e => res.status(500).json(e.message));
}

module.exports = { buscarMonitoramento, buscarUmidade };