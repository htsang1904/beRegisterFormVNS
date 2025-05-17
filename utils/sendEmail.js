const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'mail.register-form-vns.io.vn', // Thay bằng domain thật
  port: 465,                   // hoặc 587 nếu dùng TLS
  secure: true,                // true nếu dùng SSL (465)
  auth: {
    user: process.env.MAIL_USER,  // ví dụ: info@yourdomain.com
    pass: process.env.MAIL_PASS   // mật khẩu email
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