const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.CLIENT_URL}reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Reset Your Password",
        html: `
            <h1>Password Reset Request</h1>
            <p>We received a request to reset your password. Click the link below to reset it:</p>
            <a href="${resetLink}" style="color: blue; text-decoration: underline;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendPasswordResetEmail;
