var parse = require("csv-parse/sync");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const dataMoment = require('moment')


const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

// Função auxiliar para buscar arquivo do S3
async function buscarArquivoS3(bucket, key) {
    try {
        const params = { Bucket: bucket, Key: key };
        const command = new GetObjectCommand(params);
        const resultado = await s3Client.send(command);
        const csvString = await resultado.Body.transformToString();
        
        return parse.parse(csvString, {
            columns: true,
            skip_empty_lines: true
        });
    } catch (erro) {
        // Arquivo pode não existir (sem alertas ou sem OK naquele período)
        return [];
    }
}

// Obter ano e mês atual
function obterAnoMesAtual() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    return { ano, mes };
}

// Buscar dados ANUAIS
async function listarAnual() {
    const { ano } = obterAnoMesAtual();

    try {
        // Alertas (coletas com problemas)
        const alertas = await buscarArquivoS3(
            process.env.AWS_BUCKET_NAME,
            `AlertasHistorico/${ano}/alertasDoAno.csv`
        );

        // OK (coletas sem problemas)
        const coletasOk = await buscarArquivoS3(
            process.env.AWS_BUCKET_NAME,
            `ColetasHistorico/${ano}/coletaAnual.csv`
        );

        return {
            alertas,
            coletasOk,
            periodo: 'anual',
            ano
        };
    } catch (erro) {
        console.error('Erro ao buscar dados anuais:', erro);
        throw erro;
    }
}

// Buscar dados MENSAIS
async function listarMensal() {
    const { ano, mes } = obterAnoMesAtual();
    const meses = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const mesNome = meses[parseInt(mes) - 1];

    try {
        const alertas = await buscarArquivoS3(
            process.env.AWS_BUCKET_NAME,
            `AlertasHistorico/${ano}/${mes}/alertasDo${mesNome}.csv`
        
        );

        const coletasOk = await buscarArquivoS3(
            process.env.AWS_BUCKET_NAME,
            `ColetasHistorico/${ano}/${mes}/coletaMensal.csv`
        );

        return {
            alertas,
            coletasOk,
            periodo: 'mensal',
            ano,
            mes: mesNome
        };
    } catch (erro) {
        console.error('Erro ao buscar dados mensais:', erro);
        throw erro;
    }
}

// Buscar dados SEMANAIS
async function listarSemanal() {
    const { ano, mes } = obterAnoMesAtual();
    const agora = new Date();
    var semana = dataMoment().week()
    var semanaAtual = semana - 1;
   console.log(semanaAtual)
   console.log(semanaAtual)
   console.log(semanaAtual)
   console.log(semanaAtual)
   console.log(semanaAtual)
   console.log(semanaAtual)
   console.log(semanaAtual)
   console.log(semanaAtual)

    try {
        const alertas = await buscarArquivoS3(
            process.env.AWS_BUCKET_NAME,
            `AlertasHistorico/${ano}/${mes}/Semana${semanaAtual}/alertaDaSemana.csv`
        );

        const coletasOk = await buscarArquivoS3(
            process.env.AWS_BUCKET_NAME,
            `ColetasHistorico/${ano}/${mes}/Semana${semanaAtual}/coletaSemanal.csv`
        );

        return {
            alertas,
            coletasOk,
            periodo: 'semanal',
            ano,
            mes,
            semanaAtual
        };
    } catch (erro) {
        console.error('Erro ao buscar dados semanais:', erro);
        throw erro;
    }
}

// Buscar dados DIÁRIOS
async function listarDiario() {
    const { ano, mes } = obterAnoMesAtual();
    var dia = String(new Date().getDate()).padStart(2, '0');
    var semana = dataMoment().week()
    var semanaAtual = semana - 1;


    try {
        const alertas = await buscarArquivoS3(
            process.env.AWS_BUCKET_NAME,
            `AlertasHistorico/${ano}/${mes}/Semana${semanaAtual}/${dia}/alertasDoDia.csv`
        );

        const coletasOk = await buscarArquivoS3(
            process.env.AWS_BUCKET_NAME,
            `ColetasHistorico/${ano}/${mes}/Semana${semanaAtual}/${dia}/coletaDiaria.csv`
        );

        return {
            alertas,
            coletasOk,
            periodo: 'diario',
            ano,
            mes,
            dia,
            semanaAtual
        };
    } catch (erro) {
        console.error('Erro ao buscar dados diários:', erro);
        throw erro;
    }
}

module.exports = {
    listarDiario,
    listarAnual,
    listarMensal,
    listarSemanal
};