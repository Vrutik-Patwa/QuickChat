import express from "express";
import {
  getMessages,
  getUsersForSideBar,
  markMessages,
  sendMessage,
} from "../controllers/messageController";
import { protectRoute } from "../middleware/auth";

const messageRouter = express.Router();

messageRouter.get("/getUsers", protectRoute, getUsersForSideBar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("mark/:id", protectRoute, markMessages);
messageRouter.post("/send/:id", protectRoute, sendMessage);
export default messageRouter;
