var parse = require("csv-parse/sync");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const dataMoment = require('moment')
var database = require("../database/config");

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

async function listarDiario() {
    var anoAtual = new Date().getFullYear()
    var mes = new Date().getMonth()+1;
    var mesAtual = mes < 10 ? ('0' + mes) : mes
    var semanaAtual = dataMoment.week()
    var diaAtual = dataMoment.days

    const params = {
        Bucket: process.env.BUCKET_CLIENT,
        Key: `AlertasHistorico/${anoAtual}/${mesAtual}/Semana${semanaAtual}/alertaDaSemana.csv`
    };

    const command = new GetObjectCommand(params);

    var resultado = await s3Client.send(command);
    var csvString = await resultado.Body.transformToString();

    const dataJSON = parse.parse(csvString, {
        columns: true,
        skip_empty_lines: true
    });

    return dataJSON
}


async function listarSemanal() {
    var anoAtual = new Date().getFullYear()
    var mes = new Date().getMonth()+1;
    var mesAtual = mes < 10 ? ('0' + mes) : mes
    var semanaAtual = dataMoment.week()

    const params = {
        Bucket: process.env.BUCKET_CLIENT,
        Key: `AlertasHistorico/${anoAtual}/${mesAtual}/Semana${semanaAtual}/alertaDaSemana.csv`
    };

    const command = new GetObjectCommand(params);

    var resultado = await s3Client.send(command);
    var csvString = await resultado.Body.transformToString();

    const dataJSON = parse.parse(csvString, {
        columns: true,
        skip_empty_lines: true
    });

    return dataJSON
}

async function listarMensal() {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    var anoAtual = new Date().getFullYear()
    var mes = new Date().getMonth()+1;
    var mesAtual = mes < 10 ? ('0' + mes) : mes

    const params = {
        Bucket: process.env.BUCKET_CLIENT,
        Key: `AlertasHistorico/${anoAtual}/${mesAtual}/alertasDo${meses[mes-1]}.csv`
    };

    const command = new GetObjectCommand(params);

    var resultado = await s3Client.send(command);
    var csvString = await resultado.Body.transformToString();

    const dataJSON = parse.parse(csvString, {
        columns: true,
        skip_empty_lines: true
    });

    return dataJSON
}

async function listarAnual() {
    var anoAtual = new Date().getFullYear()

    const params = {
        Bucket: process.env.BUCKET_CLIENT,
        Key: `AlertasHistorico/${anoAtual}/alertasDoAno.csv`
    };

    const command = new GetObjectCommand(params);

    var resultado = await s3Client.send(command);
    var csvString = await resultado.Body.transformToString();

    const dataJSON = parse.parse(csvString, {
        columns: true,
        skip_empty_lines: true
    });

    return dataJSON
}



function listarAreas(fkHospital){
    console.log("ACESSEI O Model areas");
    var instrucaoSql=`SELECT DISTINCT area
                    FROM Sala
                    WHERE fkHospital = ${fkHospital};`
    return database.executar(instrucaoSql); 
}



module.exports = {
    listarDiario,
    listarSemanal,
    listarMensal,
    listarAnual,
    listarAreas
};