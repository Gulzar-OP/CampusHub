import Users from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import OTP from "../models/otp.js";
import sendOTP from "../utils/sendOTP.js";

export const generateOTP = async (email) => {

  const otp = Math.floor(100000 + Math.random() * 900000);

  await OTP.create({
    email,
    otp,
  });

  return otp;
};

export const register = async (req, res) => {
  const {
    collegeId,
    name,
    email,
    password,
    phone,
    address,
    college,
    branch,
    year,
    role,
  } = req.body

  try {
    const avatarFile = req.files?.avatar?.[0]
    const collegeIdPicFile = req.files?.image?.[0]

    if (!avatarFile) {
      return res.status(400).json({ message: "Avatar is required" })
    }

    if (!collegeIdPicFile) {
      return res.status(400).json({ message: "College ID proof is required" })
    }

    const avatarStr = `data:${avatarFile.mimetype};base64,${avatarFile.buffer.toString("base64")}`
    const avatarUpload = await cloudinary.uploader.upload(avatarStr)

    const idPicStr = `data:${collegeIdPicFile.mimetype};base64,${collegeIdPicFile.buffer.toString("base64")}`
    const idPicUpload = await cloudinary.uploader.upload(idPicStr)

    const existingUser = await Users.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new Users({
      collegeId,
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      college,
      branch,
      year,
      role,
      avatar: avatarUpload.secure_url,
      collegeIdPic: idPicUpload.secure_url,
    })

    const savedUser = await newUser.save()
    return res.status(201).json({ message: "User registered successfully", savedUser })
  } catch (error) {
    console.error("Error registering user:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    // Check user
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // ==============================
    // IF USER NOT VERIFIED
    // ==============================

    if (!user.isVerified) {

      // generate otp
      const otp = await generateOTP(user.email);

      console.log("Generated OTP:", otp);

      // save otp in db
      await OTP.create({
        email: user.email,
        otp,
      });

      // send otp email
      await sendOTP(user.email, otp);

      return res.status(200).json({
        success: true,
        message: "OTP sent to email",
        requiresOTP: true,
        email: user.email,
      });
    }

    // ==============================
    // IF USER VERIFIED
    // ==============================

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const myProfile = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserById = async (req, res) => {

    const { id } = req.params;

    console.log("Received ID:", id);

    try {

        const user = await Users.findById(id).select("-password");

        console.log("Fetched User:", user);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {

        console.error("FULL ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};



export const verifyOTP = async (req, res) => {

  const { email, otp } = req.body;

  try {

    // find otp
    const existingOTP = await OTP.findOne({ email, otp });

    if (!existingOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // find user
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // mark verified
    user.isVerified = true;

    await user.save();

    // delete otp after verify
    await OTP.deleteOne({ _id: existingOTP._id });

    // generate jwt
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // send cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};