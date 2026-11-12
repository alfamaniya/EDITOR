const fs = require('node:fs');
const path = require('node:path');
const nodemailer = require('nodemailer');

async function main() {
  const file = path.resolve(__dirname, '..', 'dist', 'project.html.jpg');
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
    text: 'The complete EDITOR project is attached as project.html.jpg.\n\nComplete HTML source:\n\n' + html,
    attachments: [{
      filename: 'project.html.jpg',
      content: html,
      contentType: 'image/jpeg'
    }]
  });
  console.log('Email sent to ' + recipient + ' with project.html.jpg attached and included in the message body.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
