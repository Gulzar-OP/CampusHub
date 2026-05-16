import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://gulzarhu80_db_user:sbgz2917@cluster0.y1abuh5.mongodb.net/campusHub")

    console.log("MongoDB connected successfully");
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;