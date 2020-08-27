require("dotenv/config");
let mailer = require("nodemailer");

// mongo schemas
const Product = require("./modals/productSchema").Product;

function createTransport() {
    return mailer.createTransport({
        host: "smtp.mail.yahoo.com",
        port: 465,
        service: "yahoo",
        auth: {
            user: "rkdooleea@yahoo.com",
            pass: process.env.PASSWORD,
        },
    });
}

async function sendConfirmationEmail(email, key, res) {
    let transporter = createTransport();

    let html = "yooo";

    let mail = {
        from: "rkdooleea@yahoo.com",
        to: `${email}`,
        // subject: `Amazon price drop!`,
        subject: "AmaTrack alert confirmation",
        html: html,
    };

    transporter.sendMail(mail, async (error, info) => {
        if (error) {
            console.log(`EMAIL ERROR: ${error}`);

            // remove key from db
            await Product.findOneAndDelete({ key: key });
            console.log(`key deleted: ${key}`);

            res.json({
                status: 400,
                message: `EMAIL ERROR: ${error}`
            })
        } else {
            console.log(`EMAIL SENT SUCCESSFULLY: ${info.response}`);
            res.json({
                status: 200,
                message: `EMAIL SENT SUCCESSFULLY: ${info.response}`
            })
        }
    });
}

exports.sendConfirmationEmail = sendConfirmationEmail;