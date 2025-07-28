import { use } from "react";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import { data } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const { socket, axios } = useContext(AuthContext);
  //   const [unseenMessages, setUnseenMessages] = useState([]);
  //   function to get all users from sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/getUsers");
      //   console.log("Data", data);

      if (data.success) {
        setUsers(data.user);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      console.log("Error");
      toast.error(error.message);
    }
  };
  //   function to get message foe selecter user
  const getSelectedMessages = async (userID) => {
    try {
      const { data } = await axios.get(`api/messages/${userID}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch {
      toast.error(error.message);
    }
  };

  //   function to send message to a user
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prevMessages) => {
          [...prevMessages, data.newMessage];
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //   subscribe to messages for current user
  const subscribeToMessages = async () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId == selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };
  //   unsubscribe to messages
  const unsubscribeToMessages = () => {
    if (socket) socket.off("newMessage");
  };
  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeToMessages();
  }, [socket, selectedUser]);
  const values = {
    messages,
    users,
    selectedUser,
    getUsers,
    sendMessage,
    setMessages,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };
  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};
