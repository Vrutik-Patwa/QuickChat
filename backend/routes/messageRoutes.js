import express from "express";
import {
  getMessages,
  getUsersForSideBar,
  markMessages,
} from "../controllers/messageController";
import { protectRoute } from "../middleware/auth";

const messageRouter = express.Router();

messageRouter.get("/getUsers", protectRoute, getUsersForSideBar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("mark/:id", protectRoute, markMessages);

export default messageRouter;
