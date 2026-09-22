import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// GET ALL USERS EXCEPT CURRENT USER
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    })
      .select("name email avatar course year")
      .limit(50);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// GET CURRENT USER CONVERSATIONS
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user._id,
    })
      .populate("members", "name email avatar course year")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// CREATE OR GET EXISTING CONVERSATION
export const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let conversation = await Conversation.findOne({
      members: {
        $all: [req.user._id, userId],
      },

      $expr: {
        $eq: [{ $size: "$members" }, 2],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [req.user._id, userId],
      });
    }

    await conversation.populate(
      "members",
      "name email avatar course year"
    );

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// GET MESSAGES OF A CONVERSATION
export const getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      members: req.user._id,
    });

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    const messages = await Message.find({
      conversation: conversation._id,
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      members: req.user._id,
    });

    if (!conversation) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text: text.trim(),
      readBy: [req.user._id],
    });

    conversation.lastMessage = text.trim();

    await conversation.save();

    await message.populate("sender", "name avatar");

    const io = req.app.get("io");

    io?.to(String(conversation._id)).emit(
      "message:new",
      message
    );

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Send message error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};