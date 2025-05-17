const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'mail.register-form-vns.io.vn',
  port: 465,                
  secure: true,
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS
  }
});

async function sendEmailWithAttachments({ to, subject, html, attachments }) {
  await transporter.sendMail({
    from: `"Exam Registration" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
    attachments
  });
}

module.exports = { sendEmailWithAttachments };