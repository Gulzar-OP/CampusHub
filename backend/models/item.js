import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title:{
        type: String,
        required: true,
        enum: ["lost", "found", "sell", "needs"],
        trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    //   required: true,
    },

    category: {
      type: String,
      enum: ["books", "electronics", "cycle", "clothes", "furniture", "keys", "others"],
      default: "others",
    },

    // image: [
    //   {
    //     type: String, // Cloudinary URLs
    //   },
    // ],

    price: {
      type: Number,
      default: 0, // only for sell
    },

    location: {
      type: String, // campus / hostel / block
    },

    status: {
      type: String,
      enum: ["open", "claimed", "sold"],
      default: "open",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    //   required: true,
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);