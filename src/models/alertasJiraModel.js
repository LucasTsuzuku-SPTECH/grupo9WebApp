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
function buscarChamadosS3() {
    const params = {
        Bucket: process.env.BUCKET_CLIENT,
        Key: "Alertas/alertaDiario.csv" 
    };

    const command = new GetObjectCommand(params);

    return s3Client.send(command)
        .then((data) => data.Body.transformToString());
}
module.exports = {
    buscarChamadosS3
};