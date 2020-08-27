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

async function sendConfirmationEmail(data, res) {
    let transporter = createTransport();

    let html =
        ` <div style="
        width: 90%;
        height: 100%;
        box-shadow: -12px -12px 30px 5px rgba(255, 255, 255, 0.9),
          12px 12px 30px 5px rgba(50, 58, 73, 0.2);
        background-color: #f5f6f7;
        border-radius: 15px;
        font-family: Comic Sans MS, cursive, sans-serif;
      ">
          <div
              style="height: 20%; background-color: #232f3e; padding: 15px 25px 15px 20px; box-sizing: border-box; border-radius: 10px 10px 0 0; display: flex; align-items: center;">
              <h3 style="color: rgba(249,225,115,1); letter-spacing: 1.5px;">AmaTrack email confirmation</h3>
          </div>
  
          <div style="height: 60%; padding: 15px 25px 15px 20px; box-sizing: border-box;">
              <p>You will be notified when the following item's price is equal to or below <span
                      style="color: #0066c0;">$${data.desiredPrice}</span></p>
              <p style="margin-top: 30px;">Product: <span style="color: #0066c0;">${data.title}</span></p>
              <p style="margin-top: 15px;">Product link: <a href="${data.url}"
                      style="color: #0066c0;">${data.url}</a></p>
              <p style="margin-top: 15px;">Product's actual price: <span style="color: #0066c0;">$${data.actualPrice}</span> </p>
              <p style="margin-top: 15px;">Use the following key on the website to cancel the alert: <span style="color: #0066c0; font-weight: bold;">${data.key}</span>
              </p>
          </div>
          <div
              style="height: 20%; padding: 15px 25px 15px 20px; box-sizing: border-box; border-radius: 0 0 10px 10px; display: flex; align-items: flex-end; justify-content: flex-end;">
              <small style="color: rosybrown;">Reetesh Dooleea</small>
          </div>
      </div>
  `

    let mail = {
        from: "rkdooleea@yahoo.com",
        to: `${data.email}`,
        // subject: `Amazon price drop!`,
        subject: "AmaTrack email confirmation",
        html: html,
    };

    transporter.sendMail(mail, async (error, info) => {
        if (error) {
            console.log(`EMAIL ERROR: ${error}`);

            // remove key from db
            await Product.findOneAndDelete({ key: data.key });
            console.log(`key deleted: ${data.key}`);

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