import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check token from cookies
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Check token from Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found",
      });
    }

    // console.log("Token:", token);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    req.user = await User.findById(decoded.id).select("-password");

    // User not found
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    console.error("Protect Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};