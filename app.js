const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { generatePDF } = require('./utils/pdfGenerator');
const { sendEmailWithAttachments } = require('./utils/sendEmail');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer storage setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Route: /register
app.post('/register', upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'card_image', maxCount: 1 },
  { name: 'passport_image', maxCount: 1 },
]), async (req, res) => {
  try {
    const formData = JSON.parse(req.body.formData);

    const pdfFile = req.files['pdf']?.[0];
    const cardImageFile = req.files['card_image']?.[0];
    const passportImageFile = req.files['passport_image']?.[0];

    if (!formData || !pdfFile || !cardImageFile || !passportImageFile) {
      return res.status(400).json({ error: 'Thiếu thông tin hoặc file.' });
    }

    // Send email
    await sendEmailWithAttachments({
      to: [formData.email, process.env.ADMIN_EMAIL],
      subject: 'Successful Registration for the Vietnamese Language Proficiency Exam',
      html: `<div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background: #f9f9f9;">
      <h2 style="color: #4CAF50;">Congratulations, ${formData.candidateName}!</h2>
      <p style="font-size: 16px;">
        You have successfully registered for the <strong>VIETNAMESE PROFICIENCY TEST</strong>.
      </p>
      <p>
        <strong>Email:</strong> ${formData.email} <br/>
        <strong>Candidate Name:</strong> ${formData.candidateName}
      </p>
      <p>
        We have attached your registration document as a PDF, along with your ID card and passport images for your records.
      </p>
      <p style="font-size: 16px; color: #555;">
        If you have any questions, please feel free to contact us via this email.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 14px; color: #999;">
        Best regards,<br/>
        The Exam Organizing Committee
      </p>
    </div> `,
      attachments: [
        { filename: 'registration.pdf', path: pdfFile.path },
        { filename: 'card_image.jpg', path: cardImageFile.path },
        { filename: 'passport_image.jpg', path: passportImageFile.path },
      ],
    });
    //  await sendEmailWithAttachments({
    //   to: [formData.email, process.env.ADMIN_EMAIL],
    //   subject: 'Successful Registration for the Vietnamese Language Proficiency Exam',
    //   html: `<div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background: #f9f9f9;">
    //   <h2 style="color: #4CAF50;">Congratulations, ${formData.candidateName}!</h2>
    //   <p style="font-size: 16px;">
    //     You have successfully registered for the <strong>VIETNAMESE PROFICIENCY TEST</strong>.
    //   </p>
    //   <p>
    //     <strong>Email:</strong> ${formData.email} <br/>
    //     <strong>Candidate Name:</strong> ${formData.candidateName}
    //   </p>
    //   <p>
    //     We have attached your registration document as a PDF, along with your ID card and passport images for your records.
    //   </p>
    //   <p style="font-size: 16px; color: #555;">
    //     If you have any questions, please feel free to contact us via this email.
    //   </p>
    //   <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    //   <p style="font-size: 14px; color: #999;">
    //     Best regards,<br/>
    //     The Exam Organizing Committee
    //   </p>
    // </div> `,
    //   attachments: [
    //     { filename: 'registration.pdf', path: pdfFile.path },
    //     { filename: 'card_image.jpg', path: cardImageFile.path },
    //     { filename: 'passport_image.jpg', path: passportImageFile.path },
    //   ],
    // });

    res.status(200).json({ message: 'Đăng ký thành công và email đã được gửi.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi xử lý đăng ký.' });
  }
});
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});