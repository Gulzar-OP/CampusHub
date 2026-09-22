import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();
const server = http.createServer(app);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const io = new Server(server, {
  cors: { origin: CLIENT_URL, credentials: true },
});
app.set("io", io);

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) =>
  res.json({ success: true, message: "CampusHub API is running" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(500)
    .json({ success: false, message: err.message || "Internal server error" });
});

io.on("connection", (socket) => {
  socket.on("conversation:join", (id) => socket.join(String(id)));
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() =>
    server.listen(PORT, () => console.log(`CampusHub API running on ${PORT}`)),
  )
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
