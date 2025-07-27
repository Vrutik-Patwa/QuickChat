import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
// Creating express app and HTTP server

const app = express();
const server = http.createServer(app);
// app.use(express.json());
// Initalizing the socket.io server
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// storing online users

export const userSocketMap = {}; //userId:socketID

//Socket.io connection handler
io.on("connection", (socket) => {
  const userID = socket.handshake.query.userID;
  console.log("USER CONNECTED", userId);
  if (userID) userSocketMap[userID] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("User disconnected at", userID);
    delete userSocketMap[userID];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup

app.use(express.json({ limit: "4mb" }));
app.use(cors());

// routes
app.use("/api/status", (req, res) => {
  res.send("Server is Live");
});

app.use("/api/auth", userRouter);
// connecting to mongodb

app.use("/api/messages", messageRouter);

await connectDB();

// defining the port no

const PORT = process.env.port || 5000;

server.listen(PORT, () => {
  console.log("server is running on port ", PORT);
});
