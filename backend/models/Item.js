import mongoose from "mongoose";
const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: ["lost", "found", "sell", "needs"],
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "books",
        "electronics",
        "cycle",
        "clothes",
        "furniture",
        "keys",
        "others",
      ],
      default: "others",
    },
    price: { type: Number, default: 0, min: 0 },
    location: { type: String, default: "" },
    status: {
      type: String,
      enum: ["open", "claimed", "sold"],
      default: "open",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export default mongoose.model("Item", itemSchema);
