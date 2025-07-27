import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";

// Creating express app and HTTP server

const app = express();
const server = http.createServer(app);

// Middleware setup

app.use(express.json({ limit: "4mb" }));
app.use(cors());

// routes
app.use("/api/status", (req, res) => {
  res.send("Server is Live");
});

app.use("/api/auth", userRouter);
// connecting to mongodb

await connectDB();

// defining the port no

const PORT = process.env.port || 5000;

server.listen(PORT, () => {
  console.log("server is running on port ", PORT);
});
