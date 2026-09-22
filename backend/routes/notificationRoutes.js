import express from "express";

import { protect } from "../middleware/auth.js";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notificationController.js";

const router = express.Router();


// ALL NOTIFICATION ROUTES ARE PROTECTED
router.use(protect);


// GET NOTIFICATIONS
router.get(
  "/",
  getNotifications
);


// MARK ALL AS READ
router.patch(
  "/read-all",
  markAllNotificationsRead
);


// MARK SINGLE NOTIFICATION AS READ
router.patch(
  "/:id/read",
  markNotificationRead
);


export default router;