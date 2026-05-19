import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "FOUND" : "NOT FOUND");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true,
      logger: true,
    });

    console.log("VERIFYING SMTP...");

    await transporter.verify();

    console.log("SMTP READY");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT:", info);

  } catch (error) {
    console.log("FULL EMAIL ERROR:");
    console.log(error);
  }
};

export default sendEmail;