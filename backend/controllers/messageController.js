// get all users except logged in user

import Message from "../models/Message.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    // count no of messages not seen
    const UnseenMessage = {};
    const promises = filteredUsers.map(async (user) => {
      const message = await Message.find({
        senderId: user._id,
        recieverId: userID,
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
    const { messages, seen } = await Message.find(
      $or[
        ({
          senderId: selectedUserIdid,
          recieverId: recieverId,
        },
        {
          recieverId: selectedUserIdid,
          senderId: recieverId,
        })
      ]
    );
    await Message.updateMany(
      { senderId: selectedUserId, recieverId: myId },
      { seen: true }
    );
    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
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
      message: message,
      image: ImageUrl,
      seen: false,
    });
    res.json({ success: true, newMessage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
