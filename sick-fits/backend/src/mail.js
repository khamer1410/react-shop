const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const generateTemplate = text => `
<div className="mail" style="
  border: solid 1 px;
  padding: 20px;
  font-family: sans-serif;
  line-height: 2;
  font-size: 20px;
  ">
  <h2>Hello there!</h2>
  <p>${text}</p>

  <p>Greetings!</p>
</div>
`

exports.transport = transport
exports.generateTemplate = generateTemplate