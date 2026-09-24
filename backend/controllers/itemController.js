
import Item from "../models/Item.js";

// ================= GET ALL ITEMS =================
export const getItems = async (req, res) => {
  try {
    const {
      q = "",
      title,
      category,
      status = "open",
      page = 1,
      limit = 12,
      mine,
    } = req.query;

    const filter = {};

    if (title && title !== "all") {
      filter.title = title;
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    // ================= SEARCH =================

    if (q.trim()) {
      const safe = q
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        "name",
        "description",
        "location",
        "category",
      ].map((key) => ({
        [key]: {
          $regex: safe,
          $options: "i",
        },
      }));
    }

    // ================= USER'S OWN ITEMS =================

    if (mine) {
      filter.postedBy = mine;
    }

    // ================= PAGINATION =================

    const currentPage = Math.max(
      1,
      Number(page) || 1,
    );

    const currentLimit = Math.min(
      50,
      Math.max(1, Number(limit) || 12),
    );

    const skip =
      (currentPage - 1) * currentLimit;

    const [items, total] = await Promise.all([
      Item.find(filter)
        .populate(
          "postedBy",
          "name email avatar course year",
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(currentLimit),

      Item.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      items,
      total,
      page: currentPage,
      pages: Math.max(
        1,
        Math.ceil(total / currentLimit),
      ),
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: `Internal server error: , ${error.message}`,
    });
  }
};

// ================= GET SINGLE ITEM =================
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          views: 1,
        },
      },
      {
        new: true,
      },
    )
      .populate(
        "postedBy",
        "name email avatar course year location",
      )
      .populate(
        "claimedBy",
        "name email avatar",
      );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

// ================= CREATE ITEM =================
export const createItem = async (req, res) => {
  try {

    const {
      title,
      name,
      category,
      description,
      location,
      price,
    } = req.body;

    // ================= REQUIRED FIELDS =================

    if (!title || !name) {
      return res.status(400).json({
        success: false,
        message: "Title and name are required",
      });
    }

    // ================= CREATE =================

    const item = await Item.create({
      title,
      name,

      category:
        category || "others",

      description:
        description || "",

      location:
        location || "",

      price:
        title === "sell"
          ? Number(price) || 0
          : 0,

      // Cloudinary image URL
      image:
        req.file?.path || "",

      postedBy:
        req.user._id,
    });

    await item.populate(
      "postedBy",
      "name email avatar course year",
    );

    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      item,
    });
  } catch (error) {

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create item",
    });
  }
};

// ================= UPDATE ITEM =================
export const updateItem = async (req, res) => {
  try {

    const item = await Item.findById(
      req.params.id,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // ================= ONLY OWNER =================

    if (
      String(item.postedBy) !==
      String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to update this item",
      });
    }

    const {
      title,
      name,
      category,
      description,
      location,
      price,
      status,
    } = req.body;

    // ================= UPDATE FIELDS =================
    // undefined field ko update nahi karenge

    if (title !== undefined) {
      item.title = title;
    }

    if (name !== undefined) {
      item.name = name;
    }

    if (category !== undefined) {
      item.category = category;
    }

    if (description !== undefined) {
      item.description = description;
    }

    if (location !== undefined) {
      item.location = location;
    }

    if (status !== undefined) {
      item.status = status;
    }

    // ================= PRICE =================

    // Final title check kar rahe hain
    if (item.title === "sell") {
      if (price !== undefined) {
        item.price =
          Number(price) || 0;
      }
    } else {
      item.price = 0;
    }

    // ================= NEW IMAGE =================
    if (req.file) {
      item.image = req.file.path;
    }

    await item.save();

    await item.populate(
      "postedBy",
      "name email avatar course year",
    );

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        error.message
    });
  }
};

// ================= UPDATE STATUS =================
export const updateItemStatus = async (
  req,
  res,
) => {
  try {
    const item = await Item.findById(
      req.params.id,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // ================= ONLY OWNER =================

    if (
      String(item.postedBy) !==
      String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    const { status } = req.body;

    const allowedStatuses = [
      "open",
      "claimed",
      "sold",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    item.status = status;

    await item.save();

    return res.status(200).json({
      success: true,
      message:
        "Item status updated successfully",
      item,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE ITEM =================
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(
      req.params.id,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // ================= ONLY OWNER =================

    if (
      String(item.postedBy) !==
      String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Item deleted",
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: `Delete item error : ${error.message}`,
    });
  }
};

