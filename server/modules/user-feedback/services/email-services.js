const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Prevents some local dev SSL errors
    }
});

const { generateInquiryTemplate } = require('./inq-mail-templates');

const sendInquiryEmail = async (ticketData, studentName) => {
    const mailOptions = {
        from: `"UniHelp Support Portals" <${process.env.EMAIL_USER}>`,
        to: process.env.LECTURER_EMAIL || process.env.EMAIL_USER,
        subject: `[DIAGNOSTIC SIGNAL] ${ticketData.category}: ${ticketData.subject}`,
        html: generateInquiryTemplate(ticketData.category, ticketData, studentName)
    };

    try {
        console.log('--- Email Dispatch Initialization ---');
        console.log(`Recipient: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);

        const info = await transporter.sendMail(mailOptions);

        console.log('--- Email Dispatch Success ---');
        console.log(`Message ID: ${info.messageId}`);
        console.log(`Response: ${info.response}`);
    } catch (error) {
        console.log('--- Email Dispatch Failure ---');
        console.log(`Recipient: ${mailOptions.to}`);
        console.error('Error Details:', error.message);
    }
};

module.exports = {
    sendInquiryEmail
};
