import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    // transporter create
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      
    });
    transporter.verify((error, success) => {
    if (error) {
      console.log("SMTP ERROR:", error);
    } else {
      console.log("SMTP READY");
    }
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