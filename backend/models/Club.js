import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  icon: { type: String, default: "🎓" },
  category: { type: String, default: "General" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
export default mongoose.model("Club", schema);
