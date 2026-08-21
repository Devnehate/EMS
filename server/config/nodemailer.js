import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, body }) => {
    const resonse = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html: body,
    })

    return resonse;
}

export default sendEmail;