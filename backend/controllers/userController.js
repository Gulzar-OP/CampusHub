import User from "../models/User.js";
import Item from "../models/Item.js";
import Club from "../models/Club.js";
import Event from "../models/Event.js";


// ================= GET USER PROFILE =================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [posts, clubs, events] = await Promise.all([
      Item.countDocuments({
        postedBy: user._id,
      }),

      Club.countDocuments({
        members: user._id,
      }),

      Event.countDocuments({
        attendees: user._id,
      }),
    ]);

    return res.status(200).json({
      success: true,
      user,
      stats: {
        posts,
        clubs,
        events,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ================= UPDATE MY PROFILE =================
export const updateMyProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "avatar",
      "bio",
      "course",
      "year",
      "hostel",
      "location",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    await req.user.save();

    const user = await User.findById(
      req.user._id
    ).select("-password");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ================= SAVE / UNSAVE ITEM =================
export const toggleSaveItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const exists = req.user.savedItems.some(
      (item) => String(item) === String(itemId)
    );

    if (exists) {
      req.user.savedItems =
        req.user.savedItems.filter(
          (item) =>
            String(item) !== String(itemId)
        );
    } else {
      req.user.savedItems.push(itemId);
    }

    await req.user.save();

    return res.status(200).json({
      success: true,
      saved: !exists,
      savedItems: req.user.savedItems,
    });
  } catch (error) {
    console.error("Save item error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};