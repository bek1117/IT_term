const nodmailer = require("nodemailer");
const config = require("config");

class Mailserver {
    constructor() {
        this.transporter = nodmailer.createTransport({
          service: "gmail",
          host: config.get("smtp_host"),
          port: config.get("smtp_port"),
          secure: false,
          auth: {
            user: config.get("smpt_use"),
            pass: config.get("smtp_password"),
          },
        });
    }
    async sendMail(to, link) {
        await this.transporter.sendMail({
          from: config.get("smpt_use"),
          to,
          subject: "IT TERM activatio code",
          text: ``,
          html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">Hello</h2>
      <p>You've been invited to join our platform!</p>
      <p>Click the button below to accept the invitation:</p>
      <a href="http://localhost:5000/api/author/activate/${link}" style="
        display: inline-block;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      ">Accept Invitation</a>
      <p>If the button doesn’t work, copy and paste this URL into your browser:</p>
      <p><a href="http://localhost:5000/api/author/activate/${link}">${link}</a></p>
      <p style="margin-top: 20px;">Thanks,<br/>The Team</p>
    </div>
  `,
        });
    }
}


module.exports = new Mailserver()