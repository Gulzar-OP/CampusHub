import mongoose from "mongoose";
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "General" },
  date: { type: Date, required: true },
  time: { type: String, default: "10:00 AM" },
  location: { type: String, default: "Campus" },
  image: { type: String, default: "" },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
export default mongoose.model("Event", schema);
