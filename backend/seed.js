import "dotenv/config";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Item from "./models/Item.js";
import Club from "./models/Club.js";
import Event from "./models/Event.js";
import Discussion from "./models/Discussion.js";
import Notification from "./models/Notification.js";

await connectDB();
await Promise.all([
  User.deleteMany({}),
  Item.deleteMany({}),
  Club.deleteMany({}),
  Event.deleteMany({}),
  Discussion.deleteMany({}),
  Notification.deleteMany({}),
]);
const user = await User.create({
  name: "Aarav Sharma",
  email: "aarav@campus.edu",
  password: "password123",
  course: "B.Tech CSE",
  year: "3rd Year",
  bio: "Tech enthusiast and campus builder.",
});
const user2 = await User.create({
  name: "Sneha Das",
  email: "sneha@campus.edu",
  password: "password123",
  course: "B.Tech AIML",
  year: "3rd Year",
});
await Item.insertMany([
  {
    title: "lost",
    name: "iPhone 14",
    description:
      "Lost black iPhone near the mess area. It has a small scratch on the back.",
    category: "electronics",
    location: "Hostel A / Near Mess",
    postedBy: user._id,
    tags: ["iphone", "lost"],
  },
  {
    title: "found",
    name: "Water Bottle",
    description: "Blue steel bottle found near the library reading room.",
    category: "others",
    location: "Library",
    postedBy: user2._id,
  },
  {
    title: "sell",
    name: "DSA Textbook",
    description:
      "Data Structures and Algorithms textbook in very good condition.",
    category: "books",
    location: "Academic Block",
    price: 500,
    postedBy: user._id,
  },
  {
    title: "needs",
    name: "Scientific Calculator",
    description: "Need a scientific calculator for two days for my lab exam.",
    category: "electronics",
    location: "CSE Block",
    price: 0,
    postedBy: user2._id,
  },
]);
await Club.insertMany([
  {
    name: "Coding Club",
    description: "Build. Learn. Grow.",
    icon: "</>",
    category: "Technology",
    members: [user._id, user2._id],
    createdBy: user._id,
  },
  {
    name: "Photography Club",
    description: "Capture campus perspectives.",
    icon: "📷",
    category: "Creative",
    members: [user2._id],
    createdBy: user2._id,
  },
  {
    name: "Entrepreneurship Cell",
    description: "Ideas into impact.",
    icon: "💡",
    category: "Business",
    members: [user._id],
    createdBy: user._id,
  },
  {
    name: "Music Club",
    description: "Feel. Create. Belong.",
    icon: "🎵",
    category: "Culture",
    members: [],
    createdBy: user2._id,
  },
]);
await Event.insertMany([
  {
    title: "Tech Tomorrow 2026",
    description: "Innovation, coding and student project showcase.",
    category: "Tech & Innovation",
    date: new Date(Date.now() + 5 * 86400000),
    time: "10:00 AM",
    location: "Auditorium",
    attendees: [user._id],
    createdBy: user._id,
  },
  {
    title: "Culture Fest 2026",
    description: "Music, dance, drama and campus culture.",
    category: "Music & Arts",
    date: new Date(Date.now() + 10 * 86400000),
    time: "5:00 PM",
    location: "Main Ground",
    attendees: [user2._id],
    createdBy: user2._id,
  },
  {
    title: "Career Development Workshop",
    description: "Resume, interview and placement preparation.",
    category: "Career",
    date: new Date(Date.now() + 15 * 86400000),
    time: "2:00 PM",
    location: "Seminar Hall",
    attendees: [],
    createdBy: user._id,
  },
]);
await Discussion.insertMany([
  {
    title: "Best resources for DSA?",
    body: "Share your favorite DSA sheets, playlists and practice strategies.",
    category: "Academics",
    author: user._id,
    likes: [user2._id],
  },
  {
    title: "Anyone interested in weekend football?",
    body: "Planning a friendly match this weekend. Comment if interested.",
    category: "Sports",
    author: user2._id,
  },
]);
await Notification.create({
  user: user._id,
  title: "Welcome to CampusHub",
  message: "Your demo account is ready. Explore the campus!",
  type: "welcome",
});
console.log("Seed complete. Demo login: aarav@campus.edu / password123");
process.exit(0);
