// get all users except logged in user

import Message from "../models/Message.js";
import { io, userSocketMap } from "../server.js";
import User from "../models/User.js";
import mongoose from "mongoose";
export const getUsersForSideBar = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("UsrId", userId);
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    console.log("FilteredUsers", filteredUsers);
    // count no of messages not seen
    const UnseenMessage = {};
    const promises = filteredUsers.map(async (user) => {
      const message = await Message.find({
        senderId: user._id,
        recieverId: userId,
        seen: false,
      });
      if (message.length > 0) {
        UnseenMessage[user._id] = message.length;
      }
    });
    await Promise.all(promises);
    res.json({ success: true, user: filteredUsers, UnseenMessage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get all messages for  selected users

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    // Correct query and response handling
    const messages = await Message.find({
      $or: [
        {
          senderId: selectedUserId,
          recieverId: myId,
        },
        {
          recieverId: selectedUserId,
          senderId: myId,
        },
      ],
    }).sort({ createdAt: 1 }); // Optional: sort messages by time

    // Update seen status of messages sent by selectedUserId to me
    await Message.updateMany(
      { senderId: selectedUserId, recieverId: myId },
      { seen: true }
    );

    console.log("selectedUserMessages", messages);

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// api to mark  messages seen using id

export const markMessages = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//function for sending a message to user

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: recieverId } = req.params;
    const { message, image } = req.body;
    let ImageUrl;
    if (image) {
      const uploadRespnse = await cloudinary.uploader.upload(image);
      ImageUrl = uploadRespnse.secure_url;
    }
    const newMessage = await Message.create({
      senderId: senderId,
      recieverId: recieverId,
      text: message,
      image: ImageUrl,
      seen: false,
    });
    // Emitting the new message in the new user socket map
    const recieverSocketId = userSocketMap[recieverId];
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }
    res.json({ success: true, newMessage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
