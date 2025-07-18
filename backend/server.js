import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";

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

// defining the port no

const PORT = process.env.port || 5000;

server.listen(PORT, () => {
  console.log("server is running on port ", PORT);
});
