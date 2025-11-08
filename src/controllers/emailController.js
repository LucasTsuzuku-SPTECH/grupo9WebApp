const nodemailer = require("nodemailer");

async function enviarEmail(req, res) {
    const { nome, email, mensagem } = req.body;

    // Config do envio do email
    let envio = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // seu email no .env.dev
            pass: process.env.EMAIL_PASS, // senha de app no .env.dev
        },
    });

    let textoEmail = {
        from: `"Site Contato" <${process.env.EMAIL_USER}>`,
        to: "zephyrus2g@gmail.com",
        replyTo: email,
        subject: `Contato do site de ${nome}`,
        text: `Nome: ${nome}\nE-mail: ${email}\nMensagem: ${mensagem}`,
    };

    try {
        await envio.sendMail(textoEmail);
        res.json({ sucesso: true, msg: "Email enviado com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ sucesso: false, msg: "Erro ao enviar email." });
    }
};

module.exports = {
    enviarEmail
}