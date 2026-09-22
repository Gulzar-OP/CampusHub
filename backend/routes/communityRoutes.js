import express from "express";

import { protect } from "../middleware/auth.js";

import {
  getClubs,
  createClub,
  joinClub,
  getEvents,
  createEvent,
  joinEvent,
  getDiscussions,
  createDiscussion,
  likeDiscussion,
  addComment,
} from "../controllers/communityController.js";

const router = express.Router();

// CLUB ROUTES
router.get("/clubs", getClubs);

router.post("/clubs", protect, createClub);

router.post("/clubs/:id/join", protect, joinClub);

// EVENT ROUTES
router.get("/events", getEvents);

router.post("/events", protect, createEvent);

router.post("/events/:id/join", protect, joinEvent);

// DISCUSSION ROUTES
router.get("/discussions", getDiscussions);

router.post("/discussions", protect, createDiscussion);

router.post("/discussions/:id/like", protect, likeDiscussion);

router.post("/discussions/:id/comments", protect, addComment);

export default router;
