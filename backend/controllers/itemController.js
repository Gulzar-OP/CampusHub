import Item from "../models/item.js";
import cloudinary from "../utils/cloudinary.js";
import User from "../models/user.js";

export const addItem = async (req, res) => {
  try {
    const { title, name, description, price, postedBy } = req.body;

    // Check image exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }
    const file = req.file;

    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "items",
    });

    const newItem = await Item.create({
      title,
      name,
      description,
      price,
      image: uploadResponse.secure_url,
      postedBy: postedBy || req.user.id || req.user._id, // Use postedBy from request body or fallback to authenticated user
    });

    const addpost = await User.findByIdAndUpdate(
      postedBy || req.user.id || req.user._id,
      { $push: { posts: newItem._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      item: newItem,
      user: addpost
    });
  } catch (error) {
    console.error("Error adding item:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getAllItems = async (req, res) => {
    try {
        const items = await Item.find().populate("postedBy", "name email").populate("claimedBy", "name email").sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getItemById = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    try {
        const updatedItem = await Item.findByIdAndUpdate(id, {
            name,
            description,
            price
        }, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item updated successfully", item: updatedItem });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Buy an item
export const buyItem = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Here you can implement the logic for buying the item
        // For example, you might want to decrease the item's stock or create an order

        res.status(200).json({ message: "Item purchased successfully", item });
    } catch (error) {
        console.error("Error purchasing item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sellItem = async (req, res)=>{
    const { id } = req.params;

    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Here you can implement the logic for selling the item
        // For example, you might want to increase the item's stock or create a sale record

        res.status(200).json({ message: "Item sold successfully", item });
    } catch (error) {
        console.error("Error selling item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyPosts = async (req, res) => {
    const userId = req.user.id;

    try {
        const posts = await Item.find({ $expr: { $eq: ["$postedBy", userId] } })
        .populate("postedBy", "name email")
        .populate("claimedBy", "name email")
        .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching my posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getClaimedPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const posts = await Item.find({ claimedBy: userId })
      .populate("postedBy", "name email")
      .populate("claimedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Claimed posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error("Error fetching claimed posts:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const claimedPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const posts = await Item.find({ claimedBy: userId })
      .populate("postedBy", "name email")
      .populate("claimedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Claimed posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error("Error fetching claimed posts:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const claimItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId = req.params.id;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // already claimed
    if (item.claimedBy) {
      return res.status(400).json({
        success: false,
        message: "Item already claimed",
      });
    }

    // prevent self-claim
    if (item.postedBy.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot claim your own item",
      });
    }

    // claim item
    item.claimedBy = userId;
    item.status = "claimed";

    await item.save();

    // 🔥 populate AFTER save
    const updatedItem = await Item.findById(itemId)
      .populate("postedBy", "name email")
      .populate("claimedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Item claimed successfully",
      item: updatedItem,
    });

  } catch (error) {
    console.error("Claim error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// for marketplace
export const getMarketplaceItems = async (req, res) => {
  try {
    const items = await Item.find({ title: "buy" })
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Marketplace items fetched successfully",
      items,
    });
  } catch (error) {
    console.error("Error fetching marketplace items:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};