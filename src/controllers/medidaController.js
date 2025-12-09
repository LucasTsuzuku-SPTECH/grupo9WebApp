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
                const idVentiladorSerial = registro.numero_serie;

                if (!mapaDeAreas[registro.nome_area]) {
                    mapaDeAreas[registro.nome_area] = {
                        nome: registro.nome_area,
                        total: 0, estaveis: 0, alertas: 0, listaIds: new Set()
                    };
                }

                if (!mapaDeParametros[idVentiladorSerial]) mapaDeParametros[idVentiladorSerial] = [];
                if (registro.nomeComponente) {
                    mapaDeParametros[idVentiladorSerial].push({
                        componente: registro.nomeComponente,
                        max: parseFloat(registro.parametroMax),
                        min: parseFloat(registro.parametroMin)
                    });
                }
                mapaDeAreas[registro.nome_area].listaIds.add(idVentiladorSerial);
            });

            // 3. Verifica Alertas
            let idsComAlerta = new Set();

            listaCsv.forEach(leitura => {
                const idVentiladorSerial = leitura.numero_serie;

                if (idVentiladorSerial && mapaDeParametros[idVentiladorSerial]) {
                    const nomeComponenteLido = leitura.componente;
                    const limitesDoBanco = mapaDeParametros[idVentiladorSerial] || [];

                    let valorLidoLimpo = leitura.valor_lido;
                    valorLidoLimpo = valorLidoLimpo.replace(/[^0-9.,-]+/g, '').trim();
                    valorLidoLimpo = parseFloat(valorLidoLimpo.replace(',', '.'));

                    let temAlertaValido = false;

                    for (let i = 0; i < limitesDoBanco.length; i++) {
                        let limite = limitesDoBanco[i];
                        if (limite.componente.toUpperCase() === nomeComponenteLido.toUpperCase()) {
                            if (!isNaN(valorLidoLimpo) && (valorLidoLimpo > limite.max || valorLidoLimpo < limite.min)) {
                                temAlertaValido = true;
                                break;
                            }
                        }
                    }
                    if (temAlertaValido) idsComAlerta.add(idVentiladorSerial);
                }
            });

            // Contagem por área
            for (let nomeArea in mapaDeAreas) {
                let area = mapaDeAreas[nomeArea];
                area.total = 0; area.alertas = 0; area.estaveis = 0;
                area.listaIds.forEach(function (idVentiladorString) {
                    area.total++;
                    if (idsComAlerta.has(idVentiladorString)) area.alertas++; else area.estaveis++;
                });
            }

            // 4. Lógica de Risco e Disponibilidade Inicial
            let listaAreas = Object.values(mapaDeAreas).map(function (area) {
                let risco = area.total > 0 ? Math.floor((area.alertas / area.total) * 100) : 0;
                let estabilidade = area.total > 0 ? Math.floor((area.estaveis / area.total) * 100) : 0;

                let precisaReceber = 0;
                let podeDoar = 0;

                if (estabilidade >= 90) {
                    podeDoar = Math.floor(area.estaveis * 0.80);
                } else if (risco > 10) {
                    precisaReceber = Math.ceil(area.alertas / 2);
                }

                return {
                    nome: area.nome, total: area.total, estaveis: area.estaveis, alertas: area.alertas,
                    risco: risco, estabilidade: estabilidade, precisaReceber: precisaReceber,
                    podeDoar: podeDoar, origemDoacao: [], originalPodeDoar: podeDoar
                };
            });

            // 5. Distribuição com PRIORIDADE TOTAL para UTI e PS
            let doadores = listaAreas.filter(a => a.podeDoar > 0);
            let necessitados = listaAreas.filter(a => a.precisaReceber > 0);

            // Função auxiliar para normalizar nomes e verificar prioridade
            // Remove espaços, acentos e deixa maiúsculo para comparar
            function verificaPrioridade(nome) {
                const nomeLimpo = nome.toUpperCase().replace(/[^A-Z]/g, '');
                return (nomeLimpo.includes('UTI') || nomeLimpo.includes('PRONTOSOCORRO') || nomeLimpo.includes('PS'));
            }

            // Ordena Necessitados: UTI/PS primeiro, depois os de maior risco
            necessitados.sort((a, b) => {
                const prioridadeA = verificaPrioridade(a.nome) ? 1 : 0;
                const prioridadeB = verificaPrioridade(b.nome) ? 1 : 0;

                if (prioridadeA !== prioridadeB) {
                    return prioridadeB - prioridadeA; // Prioridade (1) vem antes de Comum (0)
                }
                return b.risco - a.risco; // Desempate pelo risco
            });

            // Ordena Doadores: Quem tem mais doa primeiro
            doadores.sort((a, b) => b.podeDoar - a.podeDoar);

            let doadoresEmUso = [...doadores];

            necessitados.forEach(function (receptor) {
                let falta = receptor.precisaReceber;

                for (let i = 0; i < doadoresEmUso.length; i++) {
                    let doador = doadoresEmUso[i];

                    if (falta <= 0) break;
                    if (doador.podeDoar <= 0) continue;

                    let qtdPassada = Math.min(falta, doador.podeDoar);

                    doador.podeDoar -= qtdPassada;
                    falta -= qtdPassada;

                    receptor.origemDoacao.push({
                        nome: doador.nome,
                        qtd: qtdPassada
                    });
                }
                // Se saiu do loop e falta > 0, significa que não há mais recursos disponíveis
            });

            // 6. Formatação Final e Mensagens
            let respostaFinal = listaAreas.map(function (area) {
                let status = "Estável";
                let mensagem = "Estabilidade adequada. Operação normal.";
                let valorAcao = 0;
                let valorPrecisaFront = 0;
                let valorPodeEnviarFront = 0;

                if (area.precisaReceber > 0 || area.origemDoacao.length > 0) {
                    status = "Necessita";
                    valorPrecisaFront = area.precisaReceber; // Valor original que precisava

                    let totalRecebido = area.origemDoacao.reduce((acc, curr) => acc + curr.qtd, 0);
                    valorAcao = area.precisaReceber;

                    if (totalRecebido > 0) {
                        let fontes = area.origemDoacao.map(o => `<strong>${o.qtd}</strong> unidade da <strong>${o.nome}</strong>`).join(', ');
                        let faltam = area.precisaReceber - totalRecebido;

                        if (faltam > 0) {
                            // Caso crítico: Recebeu prioridade mas acabou o estoque do hospital
                            mensagem = `- Recebeu <strong>${totalRecebido}</strong> unidades.<br>- Fontes: ${fontes}.<br>- <strong>Ainda faltam ${faltam} unidades!</strong>`;
                        } else {
                            // Recebeu tudo o que precisava
                            mensagem = `- Adicionar <strong>${totalRecebido}</strong> unidades.<br>- Deve receber: ${fontes}.`;
                        }
                    } else {
                        mensagem = `É necessário remanejar <strong>${area.precisaReceber}</strong> unidades o quanto antes.`;
                    }

                } else {
                    let doacaoOriginal = area.originalPodeDoar;

                    if (doacaoOriginal > 0) {
                        status = "Disponível";
                        valorPodeEnviarFront = doacaoOriginal;
                        valorAcao = doacaoOriginal;

                        let valorSobrando = area.podeDoar;

                        if (valorSobrando < doacaoOriginal) {
                            let qtdDoada = doacaoOriginal - valorSobrando;
                            mensagem = `- Enviar <strong>${qtdDoada}</strong> unidades (Já cedidas).<br>- Restam <strong>${valorSobrando}</strong> unidades disponíveis.`;
                        } else {
                            mensagem = `Pode enviar <strong>${doacaoOriginal}</strong> unidades para apoiar áreas em estado crítico.`;
                        }

                    } else if (area.risco <= 10) {
                        status = "Estável";
                        mensagem = "Estabilidade adequada. Operação normal.";
                        valorAcao = 0;
                    }
                }

                return {
                    nome: area.nome, total: area.total, estaveis: area.estaveis, alertas: area.alertas,
                    risco: area.risco, estabilidade: area.estabilidade, status: status,
                    mensagemAcao: mensagem, valorAcao: valorAcao,
                    precisa: valorPrecisaFront, podeEnviar: valorPodeEnviarFront
                };
            });

            // 7. Ordenação Final para o Front-end (UTI e PS sempre a esquerda)
            respostaFinal.sort((a, b) => {
                const nomeA = a.nome.toUpperCase().replace(/[^A-Z]/g, '');
                const nomeB = b.nome.toUpperCase().replace(/[^A-Z]/g, '');

                const isPriA = nomeA.includes('UTI') || nomeA.includes('PRONTOSOCORRO') || nomeA.includes('PS');
                const isPriB = nomeB.includes('UTI') || nomeB.includes('PRONTOSOCORRO') || nomeB.includes('PS');

                if (isPriA && !isPriB) return -1;
                if (!isPriA && isPriB) return 1;
                return b.risco - a.risco;
            });

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