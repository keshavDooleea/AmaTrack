require("dotenv/config");
let mailer = require("nodemailer");
let confirmationStatus;

function createTransport() {
    return mailer.createTransport({
        host: "smtp.mail.yahoo.com",
        port: 465,
        service: "yahoo",
        auth: {
            user: "rkdooleea@yahoo.com",
            //   pass: process.env.PASSWORD,
        },
    });
}

async function sendConfirmationEmail(email) {
    let transporter = createTransport();

    let html = "yooo";

    let mail = {
        from: "rkdooleea@yahoo.com",
        to: `${email}`,
        subject: `Amazon pricedrop!`,
        html: html,
    };

    transporter.sendMail(mail, async (error, info) => {
        if (error) {
            console.log(`EMAIL ERROR: ${error}`);
            confirmationStatus = {
                status: 400,
                message: `EMAIL ERROR: ${error}`
            }
        } else {
            console.log(`EMAIL SENT SUCCESSFULLY: ${info.response}`);
            confirmationStatus = {
                status: 200,
                message: `EMAIL SENT SUCCESSFULLY: ${info.response}`
            }
        }

        return confirmationStatus;
    });
}

function getConfirmationStatus() {
    return confirmationStatus;
}

exports.sendConfirmationEmail = sendConfirmationEmail;
exports.getConfirmationStatus = getConfirmationStatus;