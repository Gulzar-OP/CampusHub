import express from "express";
import { protect } from "../middleware/auth.js";
import { login, logout, me, register } from "../controllers/authController.js";

const router = express.Router();

router.post("/register",register)

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protect, me);

export default router;
