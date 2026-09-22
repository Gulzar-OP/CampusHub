import express from "express";

import { protect } from "../middleware/auth.js";

import {
  getUserProfile,
  updateMyProfile,
  toggleSaveItem,
} from "../controllers/userController.js";

const router = express.Router();


// UPDATE CURRENT USER PROFILE
router.put(
  "/me/profile",
  protect,
  updateMyProfile
);


// SAVE / UNSAVE ITEM
router.post(
  "/me/save/:itemId",
  protect,
  toggleSaveItem
);


// GET ANY USER PROFILE
router.get(
  "/:id",
  getUserProfile
);


export default router;