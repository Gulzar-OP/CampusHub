import Club from "../models/Club.js";
import Event from "../models/Event.js";
import Discussion from "../models/Discussion.js";


// ===================== CLUBS =====================

// GET ALL CLUBS
export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      clubs,
    });
  } catch (error) {
    console.error("Get clubs error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// CREATE CLUB
export const createClub = async (req, res) => {
  try {
    const club = await Club.create({
      ...req.body,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    return res.status(201).json({
      success: true,
      club,
    });
  } catch (error) {
    console.error("Create club error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// JOIN / LEAVE CLUB
export const joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const userId = String(req.user._id);

    const exists = club.members.some(
      (member) => String(member) === userId
    );

    if (exists) {
      // already member → leave club
      club.members = club.members.filter(
        (member) => String(member) !== userId
      );
    } else {
      // not member → join club
      club.members.push(req.user._id);
    }

    await club.save();

    return res.status(200).json({
      success: true,
      joined: !exists,
      club,
    });
  } catch (error) {
    console.error("Join club error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ===================== EVENTS =====================

// GET ALL EVENTS
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// CREATE EVENT
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// JOIN / LEAVE EVENT
export const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const userId = String(req.user._id);

    const exists = event.attendees.some(
      (member) => String(member) === userId
    );

    if (exists) {
      event.attendees = event.attendees.filter(
        (member) => String(member) !== userId
      );
    } else {
      event.attendees.push(req.user._id);
    }

    await event.save();

    return res.status(200).json({
      success: true,
      joined: !exists,
      event,
    });
  } catch (error) {
    console.error("Join event error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ===================== DISCUSSIONS =====================

// GET ALL DISCUSSIONS
export const getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .populate("author", "name avatar course")
      .populate("comments.user", "name avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      discussions,
    });
  } catch (error) {
    console.error("Get discussions error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// CREATE DISCUSSION
export const createDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.create({
      ...req.body,
      author: req.user._id,
    });

    await discussion.populate(
      "author",
      "name avatar course"
    );

    return res.status(201).json({
      success: true,
      discussion,
    });
  } catch (error) {
    console.error("Create discussion error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// LIKE / UNLIKE DISCUSSION
export const likeDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(
      req.params.id
    );

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    const userId = String(req.user._id);

    const exists = discussion.likes.some(
      (member) => String(member) === userId
    );

    if (exists) {
      discussion.likes = discussion.likes.filter(
        (member) => String(member) !== userId
      );
    } else {
      discussion.likes.push(req.user._id);
    }

    await discussion.save();

    return res.status(200).json({
      success: true,
      liked: !exists,
      likes: discussion.likes.length,
    });
  } catch (error) {
    console.error("Like discussion error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const discussion = await Discussion.findById(
      req.params.id
    );

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    discussion.comments.push({
      text: text.trim(),
      user: req.user._id,
    });

    await discussion.save();

    await discussion.populate(
      "comments.user",
      "name avatar"
    );

    return res.status(200).json({
      success: true,
      discussion,
    });
  } catch (error) {
    console.error("Add comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};