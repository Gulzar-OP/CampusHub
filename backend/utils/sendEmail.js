import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    // transporter create
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // mail send
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.response);

  } catch (error) {
    console.log("Email error:", error);
  }
};

export default sendEmail;