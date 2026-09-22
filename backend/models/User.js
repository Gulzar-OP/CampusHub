import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: true },
  avatar: { type: String, default: "" },
  bio: { type: String, default: "" },
  course: { type: String, default: "B.Tech CSE" },
  year: { type: String, default: "3rd Year" },
  hostel: { type: String, default: "" },
  location: { type: String, default: "Campus" },
  savedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
