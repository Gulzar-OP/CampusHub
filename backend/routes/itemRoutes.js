import express from "express";

import {
  getItems,
  getItemById,
  updateItem,
  updateItemStatus,
  deleteItem,
  createItem,
} from "../controllers/itemController.js";

import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* =========================
   CREATE ITEM
========================= */

router.post(
  "/",
  protect,
  upload.single("image"),
  createItem
);

/* =========================
   GET ALL ITEMS
========================= */

router.get(
  "/",
  getItems
);

/* =========================
   GET ONE ITEM
========================= */

router.get(
  "/:id",
  getItemById
);

/* =========================
   UPDATE ITEM
========================= */

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateItem
);

/* =========================
   UPDATE STATUS
========================= */

router.patch(
  "/:id/status",
  protect,
  updateItemStatus
);

/* =========================
   DELETE ITEM
========================= */

router.delete(
  "/:id",
  protect,
  deleteItem
);

export default router;