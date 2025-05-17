const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

exports.generatePDF = async (formData, cardImage, passportImage) => {
  const htmlTemplate = fs.readFileSync(
    path.join(__dirname, '../templates/registration.html'),
    'utf8'
  );

  const replacedHTML = htmlTemplate
    .replace(/{{formData.card_image}}/g, `file://${path.resolve(cardImage)}`)
    .replace(/{{formData.passport_image}}/g, `file://${path.resolve(passportImage)}`)
    .replace(/{{formData.candidateName}}/g, formData.candidateName)
    .replace(/{{formData.candidateBirth}}/g, formData.candidateBirth)
    .replace(/{{formData.gender}}/g, formData.gender)
    .replace(/{{formData.candidateNationality}}/g, formData.candidateNationality)
    .replace(/{{formData.passportCode}}/g, formData.passportCode)
    .replace(/{{formData.candidateAddress}}/g, formData.candidateAddress)
    .replace(/{{formData.phoneNumber}}/g, formData.phoneNumber)
    .replace(/{{formData.email}}/g, formData.email)
    .replace(/{{hasPaid}}/g, formData.hasPaid ? 'checked' : '');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(replacedHTML, { waitUntil: 'networkidle0' });

  const pdfPath = `uploads/registration-${Date.now()}.pdf`;
  await page.pdf({ path: pdfPath, format: 'A4' });

  await browser.close();
  return pdfPath;
};