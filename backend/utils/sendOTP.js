import sendEmail from "./sendEmail.js";

const sendOTP = async (email, otp) => {
  try {

    await sendEmail(
      email,

      "Your OTP Code",

      `
      <h2>Your OTP Code</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      `
    );

  } catch (error) {
    console.log("OTP send error:", error);
  }
};

export default sendOTP;