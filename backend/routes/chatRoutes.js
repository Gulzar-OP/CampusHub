import express from "express";

import { protect } from "../middleware/auth.js";

import {
  getUsers,
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
} from "../controllers/chatController.js";

const router = express.Router();

router.use(protect);

// USERS
router.get("/users", getUsers);

// CONVERSATIONS
router.get("/conversations", getConversations);

router.post("/conversations", createConversation);

// MESSAGES
router.get(
  "/conversations/:id/messages",
  getMessages
);

router.post(
  "/conversations/:id/messages",
  sendMessage
);

export default router;