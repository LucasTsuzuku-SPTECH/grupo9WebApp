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

// Busca o JSON de Umidade do S3
function buscarUmidadeS3() {
    const params = {
        Bucket: process.env.BUCKET_CLIENT,
        Key: "Crawler/Dados-Umidade/umidade_SP.json"
    };
    
    const command = new GetObjectCommand(params);
    
    return s3Client.send(command)
        .then((data) => data.Body.transformToString())
        .then((str) => JSON.parse(str));
}

// Busca o CSV de monitoramento do S3
function buscarMonitoramentoS3() {
    const params = {
        Bucket: process.env.BUCKET_CLIENT,
        Key: "Dados-Mensal/arquivoClientMensal.csv" 
    };

    const command = new GetObjectCommand(params);

    return s3Client.send(command)
        .then((data) => data.Body.transformToString());
}

// Busca ventiladores do banco filtrando pelo ID do hospital recebido
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