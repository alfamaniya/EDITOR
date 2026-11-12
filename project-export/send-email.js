const fs = require('node:fs');
const path = require('node:path');
const nodemailer = require('nodemailer');

async function main() {
  const file = path.resolve(__dirname, '..', 'dist', 'project.html.txt');
  const sender = process.env.GMAIL_ADDRESS;
  const password = process.env.GMAIL_APP_PASSWORD;
  const recipient = process.env.COMPANY_EMAIL;
  if (!sender || !password || !recipient) throw new Error('Missing GMAIL_ADDRESS, GMAIL_APP_PASSWORD, or COMPANY_EMAIL secret.');

  const html = fs.readFileSync(file, 'utf8');
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: sender, pass: password }
  });

  await transporter.sendMail({
    from: sender,
    to: recipient,
    subject: 'EDITOR project export',
    text: 'The complete EDITOR project is attached as project.html.txt. To use it as a web page, rename the downloaded file extension from .txt to .html.\n\nComplete HTML source:\n\n' + html,
    attachments: [{
      filename: 'project.html.txt',
      content: html,
      contentType: 'text/plain; charset=utf-8'
    }]
  });
  console.log('Email sent to ' + recipient + ' with project.html.txt attached and the complete HTML source included in the message body.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
