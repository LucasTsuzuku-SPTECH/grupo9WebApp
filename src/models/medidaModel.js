const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
var database = require("../database/config");

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

const BUCKET_NAME = "client-zephyrus"; 

// Retorna o nome do mês com a primeira letra maiúscula e acentos (ex: "Janeiro", "Março")
function getNomeMesAtual(data) {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return meses[data.getMonth()];
}

// Busca o JSON de Umidade do S3
function buscarUmidadeS3() {
    const params = {
        Bucket: BUCKET_NAME,
        Key: "Crawler/Dados-Umidade/umidade_SP.json"
    };
    
    const command = new GetObjectCommand(params);
    
    return s3Client.send(command)
        .then((data) => data.Body.transformToString())
        .then((str) => JSON.parse(str));
}

// Busca o CSV de monitoramento (Alertas) do S3 para o mês/ano atual
function buscarMonitoramentoS3() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mesNumero = hoje.getMonth() + 1; // getMonth() retorna 0-11
    const nomeMes = getNomeMesAtual(hoje);

    // Constrói o caminho dinâmico: AlertasHistorico/ANO/MES/alertasDoMES.csv
    const keyPath = `AlertasHistorico/${ano}/${mesNumero}/alertasDo${nomeMes}.csv`;

    console.log(`Buscando CSV no S3 em: ${BUCKET_NAME}/${keyPath}`);

    const params = {
        Bucket: BUCKET_NAME,
        Key: keyPath 
    };

    const command = new GetObjectCommand(params);

    return s3Client.send(command)
        .then((data) => data.Body.transformToString());
}

// Busca ventiladores e parâmetros do banco filtrando pelo ID do hospital
function buscarVentiladoresEParametros(idHospital) {
    
    const instrucaoSql = `
        SELECT 
            v.idVentilador,
            v.numero_serie,
            s.area AS nome_area,
            c.nomeComponente,
            p.parametroMax,
            p.parametroMin
        FROM Ventilador v
        JOIN Sala s ON v.fkSala = s.idSala
        JOIN Hospital h ON s.fkHospital = h.idHospital
        LEFT JOIN Parametro p ON p.fkVentilador = v.idVentilador
        LEFT JOIN Componente c ON p.fkComponente = c.idComponente
        WHERE h.idHospital = ${idHospital};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUmidadeS3,
    buscarMonitoramentoS3,
    buscarVentiladoresEParametros
};