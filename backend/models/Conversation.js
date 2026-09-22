import mongoose from "mongoose";
const schema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  lastMessage: { type: String, default: "" }
}, { timestamps: true });
schema.index({ members: 1 });
export default mongoose.model("Conversation", schema);
