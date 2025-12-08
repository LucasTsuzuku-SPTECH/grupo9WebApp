var gestorModel = require("../models/gestorModel");

// classifica o alerta baseando nos limites (se estourou o maximo é critico)
function classificarAlerta(tipoAlerta, valorLido, minPermitido, maxPermitido) {
    const valor = parseFloat(valorLido);
    const min = parseFloat(minPermitido);
    const max = parseFloat(maxPermitido);
    
    if (tipoAlerta === 'Acima') {
        if (valor > max) return 'critico';
        return 'atencao';
    }

    return 'operacional';
}

// pega o modelo direto do numero de serie (tipo: VNT-GEC-0008 vira GEC)
function extrairModelo(numeroSerie) {
    const partes = numeroSerie.split('-');
    return partes.length >= 2 ? partes[1] : 'Desconhecido';
}

// se o usuario filtrou por modelo, a gente limpa os dados aqui
function filtrarPorModelo(alertas, coletasOk, modelo) {
    if (modelo === 'todos') {
        return { alertas, coletasOk };
    }

    const alertasFiltrados = alertas.filter(a => extrairModelo(a.numero_serie) === modelo);
    const coletasOkFiltradas = coletasOk.filter(c => extrairModelo(c.numero_serie) === modelo);

    return { alertas: alertasFiltrados, coletasOk: coletasOkFiltradas };
}

// varre as listas pra pegar quais modelos unicos existem
function obterModelosUnicos(alertas, coletasOk) {
    const modelos = new Set();
    
    alertas.forEach(a => modelos.add(extrairModelo(a.numero_serie)));
    coletasOk.forEach(c => modelos.add(extrairModelo(c.numero_serie)));
    
    return Array.from(modelos).sort();
}

// aqui acontece a magica: junta alertas e coletas ok pra calcular kpis e uptime
function processarDadosComAlertas(alertas, coletasOk) {
    console.log(`\nprocessando dados...`);
    console.log(`alertas: ${alertas.length}`);
    console.log(`coletas ok: ${coletasOk.length}`);

    const totalColetas = alertas.length + coletasOk.length;

    // se nao tiver nada, retorna tudo zerado pra nao quebrar o front
    if (totalColetas === 0) {
        return {
            kpis: {
                totalColetas: 0,
                totalAlertas: 0,
                alertasCriticos: 0,
                alertasAtencao: 0,
                coletasOk: 0,
                uptime: '100.00',
                taxaAlerta: '0.00'
            },
            uptimeRealPorHospital: [],
            riscoPorArea: [],
            alertasPorSemana: [],
            equipamentosRanking: [],
            componentesComFalha: [],
            modelos: []
        };
    }

    let estatisticas = {
        totalAlertas: 0,
        alertasCriticos: 0,
        alertasAtencao: 0,
        porHospital: {},
        porArea: {},
        porComponente: {},
        porSemana: {},
        equipamentosProblematicos: {}
    };

    // processando cada alerta individualmente
    alertas.forEach(alerta => {
        const status = classificarAlerta(
            alerta.tipo_alerta,
            alerta.valor_lido,
            alerta.min_permitido,
            alerta.max_permitido
        );

        estatisticas.totalAlertas++;
        if (status === 'critico') estatisticas.alertasCriticos++;
        if (status === 'atencao') estatisticas.alertasAtencao++;

        // separando dados por hospital
        if (!estatisticas.porHospital[alerta.hospital]) {
            estatisticas.porHospital[alerta.hospital] = {
                ventiladoresUnicos: new Set(),
                alertas: 0,
                coletasOk: 0,
                alertasCriticos: 0,
                alertasAtencao: 0
            };
        }
        estatisticas.porHospital[alerta.hospital].ventiladoresUnicos.add(alerta.numero_serie);
        estatisticas.porHospital[alerta.hospital].alertas++;
        if (status === 'critico') estatisticas.porHospital[alerta.hospital].alertasCriticos++;
        if (status === 'atencao') estatisticas.porHospital[alerta.hospital].alertasAtencao++;

        // separando dados por area
        if (!estatisticas.porArea[alerta.area]) {
            estatisticas.porArea[alerta.area] = {
                ventiladoresUnicos: new Set(),
                totalAlertas: 0,
                alertasCriticos: 0,
                alertasAtencao: 0
            };
        }
        estatisticas.porArea[alerta.area].ventiladoresUnicos.add(alerta.numero_serie);
        estatisticas.porArea[alerta.area].totalAlertas++;
        if (status === 'critico') estatisticas.porArea[alerta.area].alertasCriticos++;
        if (status === 'atencao') estatisticas.porArea[alerta.area].alertasAtencao++;

        // vendo qual componente ta falhando mais
        if (!estatisticas.porComponente[alerta.componente]) {
            estatisticas.porComponente[alerta.componente] = {
                total: 0,
                criticos: 0
            };
        }
        estatisticas.porComponente[alerta.componente].total++;
        if (status === 'critico') estatisticas.porComponente[alerta.componente].criticos++;

        // identificando equipamento problematico
        if (!estatisticas.equipamentosProblematicos[alerta.numero_serie]) {
            estatisticas.equipamentosProblematicos[alerta.numero_serie] = {
                hospital: alerta.hospital,
                area: alerta.area,
                totalAlertas: 0,
                alertasCriticos: 0
            };
        }
        estatisticas.equipamentosProblematicos[alerta.numero_serie].totalAlertas++;
        if (status === 'critico') {
            estatisticas.equipamentosProblematicos[alerta.numero_serie].alertasCriticos++;
        }

        // organizando por semana
        const data = new Date(alerta.timestamp);
        const semana = `Sem ${Math.ceil((data.getDate()) / 7)}`;
        if (!estatisticas.porSemana[semana]) {
            estatisticas.porSemana[semana] = { atencao: 0, criticos: 0 };
        }
        if (status === 'atencao') estatisticas.porSemana[semana].atencao++;
        if (status === 'critico') estatisticas.porSemana[semana].criticos++;
    });

    // agora conta as coletas que deram bom (ok) por hospital
    coletasOk.forEach(coleta => {
        if (!estatisticas.porHospital[coleta.hospital]) {
            estatisticas.porHospital[coleta.hospital] = {
                ventiladoresUnicos: new Set(),
                alertas: 0,
                coletasOk: 0,
                alertasCriticos: 0,
                alertasAtencao: 0
            };
        }
        estatisticas.porHospital[coleta.hospital].ventiladoresUnicos.add(coleta.numero_serie);
        estatisticas.porHospital[coleta.hospital].coletasOk++;
    });

    const totalColetasOk = coletasOk.length;

    // calculando o uptime real de cada hospital
    const uptimeRealPorHospital = Object.entries(estatisticas.porHospital)
        .map(([hospital, data]) => {
            const ventiladores = data.ventiladoresUnicos.size;
            const totalColetas = data.alertas + data.coletasOk;
            const operacionais = data.coletasOk;
            const uptime = totalColetas > 0 ? ((operacionais / totalColetas) * 100).toFixed(2) : '100.00';
            
            console.log(`\n${hospital}:`);
            console.log(`  ventiladores unicos: ${ventiladores}`);
            console.log(`  alertas: ${data.alertas}`);
            console.log(`  coletas ok: ${data.coletasOk}`);
            console.log(`  total de coletas: ${totalColetas}`);
            console.log(`  uptime: ${uptime}%`);

            return {
                nomeHospital: hospital,
                ventiladores: ventiladores,
                operacionais: operacionais,
                atencao: data.alertasAtencao,
                criticos: data.alertasCriticos,
                uptime: uptime
            };
        })
        .sort((a, b) => parseFloat(b.uptime) - parseFloat(a.uptime));

    // calculo de risco por area
    const riscoPorArea = Object.entries(estatisticas.porArea)
        .map(([area, data]) => {
            const totalVents = data.ventiladoresUnicos.size;
            
            return {
                area,
                ventiladores: totalVents,
                alertas: data.totalAlertas,
                criticos: data.alertasCriticos,
                atencao: data.alertasAtencao,
                risco: estatisticas.totalAlertas > 0 ? ((data.alertasCriticos / estatisticas.totalAlertas) * 100).toFixed(2) : '0.00'
            };
        })
        .sort((a, b) => parseFloat(b.risco) - parseFloat(a.risco));

    // ranking dos top 10 equipamentos zoados
    const equipamentosRanking = Object.entries(estatisticas.equipamentosProblematicos)
        .map(([serie, data]) => ({
            numeroSerie: serie,
            modelo: extrairModelo(serie),
            hospital: data.hospital,
            area: data.area,
            alertas: data.totalAlertas,
            criticos: data.alertasCriticos
        }))
        .sort((a, b) => b.criticos - a.criticos || b.alertas - a.alertas)
        .slice(0, 10);

    // consolidando os kpis gerais
    const kpis = {
        totalColetas: alertas.length + coletasOk.length,
        totalAlertas: estatisticas.totalAlertas,
        alertasCriticos: estatisticas.alertasCriticos,
        alertasAtencao: estatisticas.alertasAtencao,
        coletasOk: totalColetasOk,
        uptime: ((totalColetasOk / (totalColetas || 1)) * 100).toFixed(2),
        taxaAlerta: (((alertas.length) / (totalColetas || 1)) * 100).toFixed(2)
    };

    // preparando dados semanais
    const alertasPorSemana = Object.entries(estatisticas.porSemana)
        .map(([semana, data]) => ({
            semana,
            atencao: data.atencao,
            criticos: data.criticos
        }))
        .sort((a, b) => {
            const semanaA = parseInt(a.semana.replace('Sem ', ''));
            const semanaB = parseInt(b.semana.replace('Sem ', ''));
            return semanaA - semanaB;
        });

    // lista de componentes problematicos
    const componentesComFalha = Object.entries(estatisticas.porComponente)
        .map(([componente, data]) => ({
            componente,
            total: data.total,
            criticos: data.criticos,
            taxaCritica: ((data.criticos / data.total) * 100).toFixed(2)
        }))
        .sort((a, b) => parseFloat(b.taxaCritica) - parseFloat(a.taxaCritica));

    // pegando a lista de modelos
    const modelos = obterModelosUnicos(alertas, coletasOk);

    console.log(`\nkpis calculados:`, kpis);
    console.log(`modelos encontrados:`, modelos);

    return {
        kpis,
        uptimeRealPorHospital,
        riscoPorArea,
        alertasPorSemana,
        equipamentosRanking,
        componentesComFalha,
        modelos
    };
}

// gera os dados pro grafico de linhas de tendencia
function obterTendenciaFalhasPorModelo(alertas, periodo) {
    const falhasPorModelo = {};
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    console.log(`\ngerando tendencia de falhas (periodo: ${periodo})`);
    console.log(`total de alertas pra analisar: ${alertas.length}`);
    
    alertas.forEach(alerta => {
        const modelo = extrairModelo(alerta.numero_serie);
        const data = new Date(alerta.timestamp);
        const mes = data.getMonth();
        const mesNome = meses[mes];
        
        if (!falhasPorModelo[modelo]) {
            falhasPorModelo[modelo] = {};
            meses.forEach(m => {
                falhasPorModelo[modelo][m] = 0;
            });
        }
        
        falhasPorModelo[modelo][mesNome]++;
    });
    
    console.log(`modelos processados:`, Object.keys(falhasPorModelo));
    
    const coresPorModelo = {
        'GEC': '#F59E0B',      
        'RSP': '#818CF8',      
        'VNX': '#4ADE80',      
        'OXY': '#EF4444'       
    };
    
    const datasets = Object.entries(falhasPorModelo)
        .sort((a, b) => {
            const totalA = Object.values(a[1]).reduce((sum, val) => sum + val, 0);
            const totalB = Object.values(b[1]).reduce((sum, val) => sum + val, 0);
            return totalB - totalA;
        })
        .map(([modelo, dados]) => {
            const modeloData = meses.map(mes => dados[mes] || 0);
            const totalFalhas = modeloData.reduce((sum, val) => sum + val, 0);
            const cor = coresPorModelo[modelo] || '#9CA3AF';
            
            console.log(`${modelo}: ${totalFalhas} falhas no total`);
            
            return {
                label: `${modelo} (${totalFalhas} falhas)`,
                data: modeloData,
                borderColor: cor,
                backgroundColor: cor,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: cor,
                pointBorderColor: '#f8f9fa',
                pointBorderWidth: 2,
                fill: false
            };
        });
    
    return { 
        meses, 
        datasets,
        modelosComDados: Object.keys(falhasPorModelo)
    };
}

// agrupa os alertas dependendo do periodo solicitado
function agruparAlertasPorPeriodo(alertas, periodo) {
    const resultado = {};
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

    if (periodo === 'diario') {
        // agrupa por hora
        for (let i = 0; i < 24; i++) {
            resultado[`${String(i).padStart(2, '0')}:00`] = { atencao: 0, criticos: 0 };
        }
        
        alertas.forEach(alerta => {
            const data = new Date(alerta.timestamp);
            const hora = String(data.getHours()).padStart(2, '0') + ':00';
            const severidade = classificarAlerta(
                alerta.tipo_alerta,
                alerta.valor_lido,
                alerta.min_permitido,
                alerta.max_permitido
            );

            if (resultado[hora]) {
                if (severidade === 'critico') resultado[hora].criticos++;
                else if (severidade === 'atencao') resultado[hora].atencao++;
            }
        });

        return Object.entries(resultado).map(([periodo, dados]) => ({
            periodo,
            atencao: dados.atencao,
            criticos: dados.criticos
        }));
    }

    if (periodo === 'semanal') {
        // agrupa por dia da semana
        dias.forEach(dia => resultado[dia] = { atencao: 0, criticos: 0 });
        
        alertas.forEach(alerta => {
            const data = new Date(alerta.timestamp);
            const diaSemana = dias[data.getDay()];
            const severidade = classificarAlerta(
                alerta.tipo_alerta,
                alerta.valor_lido,
                alerta.min_permitido,
                alerta.max_permitido
            );

            if (resultado[diaSemana]) {
                if (severidade === 'critico') resultado[diaSemana].criticos++;
                else if (severidade === 'atencao') resultado[diaSemana].atencao++;
            }
        });

        return Object.entries(resultado).map(([dia, dados]) => ({
            periodo: dia,
            atencao: dados.atencao,
            criticos: dados.criticos
        }));
    }

    if (periodo === 'mensal') {
        // agrupa por semana do mes
        for (let i = 1; i <= 5; i++) {
            resultado[`Sem ${i}`] = { atencao: 0, criticos: 0 };
        }
        
        alertas.forEach(alerta => {
            const data = new Date(alerta.timestamp);
            const dia = data.getDate();
            const semana = `Sem ${Math.ceil(dia / 7)}`;
            const severidade = classificarAlerta(
                alerta.tipo_alerta,
                alerta.valor_lido,
                alerta.min_permitido,
                alerta.max_permitido
            );

            if (resultado[semana]) {
                if (severidade === 'critico') resultado[semana].criticos++;
                else if (severidade === 'atencao') resultado[semana].atencao++;
            }
        });

        return Object.entries(resultado).map(([semana, dados]) => ({
            periodo: semana,
            atencao: dados.atencao,
            criticos: dados.criticos
        }));
    }

    if (periodo === 'anual') {
        // agrupa por mes
        meses.forEach(mes => resultado[mes] = { atencao: 0, criticos: 0 });
        
        alertas.forEach(alerta => {
            const data = new Date(alerta.timestamp);
            const mesIndex = data.getMonth();
            const mesNome = meses[mesIndex];
            const severidade = classificarAlerta(
                alerta.tipo_alerta,
                alerta.valor_lido,
                alerta.min_permitido,
                alerta.max_permitido
            );

            if (resultado[mesNome]) {
                if (severidade === 'critico') resultado[mesNome].criticos++;
                else if (severidade === 'atencao') resultado[mesNome].atencao++;
            }
        });

        return Object.entries(resultado).map(([mes, dados]) => ({
            periodo: mes,
            atencao: dados.atencao,
            criticos: dados.criticos
        }));
    }

    return [];
}

// ========== rotas do controller ==========

async function listarDiario(req, res) {
    try {
        const modelo = req.query.modelo || 'todos';
        const dados = await gestorModel.listarDiario();
        
        const { alertas, coletasOk } = filtrarPorModelo(dados.alertas, dados.coletasOk, modelo);
        const processados = processarDadosComAlertas(alertas, coletasOk);
        
        const { alertas: todosAlertas } = filtrarPorModelo(dados.alertas, dados.coletasOk, 'todos');
        const tendenciaFalhas = obterTendenciaFalhasPorModelo(todosAlertas, 'diario');
        const alertasPorPeriodo = agruparAlertasPorPeriodo(alertas, 'diario');

        res.json({
            periodo: 'diario',
            dia: dados.dia,
            mes: dados.mes,
            ano: dados.ano,
            modeloFiltrado: modelo,
            alertasPorPeriodo,
            tendenciaFalhas,
            ...processados
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "deu ruim ao listar dados diarios", detalhes: err.message });
    }
}

async function listarSemanal(req, res) {
    try {
        const modelo = req.query.modelo || 'todos';
        const dados = await gestorModel.listarSemanal();
        
        const { alertas, coletasOk } = filtrarPorModelo(dados.alertas, dados.coletasOk, modelo);
        const processados = processarDadosComAlertas(alertas, coletasOk);
        
        const { alertas: todosAlertas } = filtrarPorModelo(dados.alertas, dados.coletasOk, 'todos');
        const tendenciaFalhas = obterTendenciaFalhasPorModelo(todosAlertas, 'semanal');
        const alertasPorPeriodo = agruparAlertasPorPeriodo(alertas, 'semanal');

        res.json({
            periodo: 'semanal',
            semana: dados.semana,
            mes: dados.mes,
            ano: dados.ano,
            modeloFiltrado: modelo,
            alertasPorPeriodo,
            tendenciaFalhas,
            ...processados
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "deu ruim ao listar dados semanais", detalhes: err.message });
    }
}

async function listarMensal(req, res) {
    try {
        const modelo = req.query.modelo || 'todos';
        const dados = await gestorModel.listarMensal();
        
        const { alertas, coletasOk } = filtrarPorModelo(dados.alertas, dados.coletasOk, modelo);
        const processados = processarDadosComAlertas(alertas, coletasOk);
        
        const { alertas: todosAlertas } = filtrarPorModelo(dados.alertas, dados.coletasOk, 'todos');
        const tendenciaFalhas = obterTendenciaFalhasPorModelo(todosAlertas, 'mensal');
        const alertasPorPeriodo = agruparAlertasPorPeriodo(alertas, 'mensal');

        res.json({
            periodo: 'mensal',
            mes: dados.mes,
            ano: dados.ano,
            modeloFiltrado: modelo,
            alertasPorPeriodo,
            tendenciaFalhas,
            ...processados
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "deu ruim ao listar dados mensais", detalhes: err.message });
    }
}

async function listarAnual(req, res) {
    try {
        const modelo = req.query.modelo || 'todos';
        const dados = await gestorModel.listarAnual();
        
        const { alertas, coletasOk } = filtrarPorModelo(dados.alertas, dados.coletasOk, modelo);
        const processados = processarDadosComAlertas(alertas, coletasOk);
        
        const { alertas: todosAlertas } = filtrarPorModelo(dados.alertas, dados.coletasOk, 'todos');
        const tendenciaFalhas = obterTendenciaFalhasPorModelo(todosAlertas, 'anual');
        const alertasPorPeriodo = agruparAlertasPorPeriodo(alertas, 'anual');

        res.json({
            periodo: 'anual',
            ano: dados.ano,
            modeloFiltrado: modelo,
            alertasPorPeriodo,
            tendenciaFalhas,
            ...processados
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "deu ruim ao listar dados anuais", detalhes: err.message });
    }
}

module.exports = { listarDiario, listarSemanal, listarMensal, listarAnual };