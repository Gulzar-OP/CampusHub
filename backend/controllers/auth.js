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
  const { name, 
    email, 
    password,
    phone,
    address,
    college,
    branch,
    year,
    role
   } = req.body;
   

  try {
    const file = req.file;
    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const cloudinaryResponse = await cloudinary.uploader.upload(fileStr);
    // Check if user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new Users({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      college,
      branch,
      year,
      role,
      avatar: cloudinaryResponse.secure_url || null,
    });
    const savedUser = await newUser.save();


    res.status(201).json({ message: "User registered successfully", savedUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     const user = await Users.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });
//     const otp = await generateOTP(user.email);
//     console.log("Generated OTP:", otp);
//     const otpMessage = `Your OTP for login is: ${otp}`;
//     // Send OTP to user via email or SMS
//     await OTP.create({ email: user.email, otp });
//     await sendOTP(user.email, otpMessage);

//     res.cookie("token", token, {
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000, // 1 din
//     }).status(200).json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//       message: "User logged in successfully",
//     });

//   } catch (error) {
//     console.error("Error logging in user:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

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
    try {
        const user = await Users.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
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