import jwt from "jsonwebtoken";

export const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const sendToken = (res, user, status = 200) => {
  const token = createToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const safeUser = user.toObject();
  delete safeUser.password;
  return res.status(status).json({ success: true, user: safeUser, token });
};
