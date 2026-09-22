import express from "express";
import User from "../models/User.js";
import { sendToken } from "../utils/token.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, course, year } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password are required" });
    if (await User.findOne({ email })) return res.status(409).json({ success: false, message: "Email already registered" });
    const user = await User.create({ name, email, password, course, year });
    return sendToken(res, user, 201);
  } catch (e) { return res.status(500).json({ success: false, message: e.message }); }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: "Invalid email or password" });
    return sendToken(res, user);
  } catch (e) { return res.status(500).json({ success: false, message: e.message }); }
};

export const logout = async(_req, res) => {
  res.clearCookie("token", { sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", secure: process.env.NODE_ENV === "production" });
  res.json({ success: true, message: "Logged out" });
};

export const me = async(req, res) => res.json({ success: true, user: req.user });