import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

export function sendOtpEmail(to, code){
    return transporter.sendMail({
        from: `"Placement Cell" <${process.env.SMTP_USER}>`,
        to,
        subject: "Your CUCHD Verification Code",
        text: `Your OTP code is ${code}. It will expire in 5 minutes.`,
    })
}