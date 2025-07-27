import { useState } from "react";
import { use } from "react";
import { useEffect } from "react";
import { Children } from "react";
import { createContext } from "react";
import toast from "react-hot-toast";
export const AuthContext = createContext();
import axios from "axios";
const backend_url = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backend_url;
import { io } from "socket.io-client";
export const AuthProvier = ({ Children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  //   Checking if user is authennticated if so,set the data and connecting the user to the socket
  const checkAuth = async () => {
    try {
      const data = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //   Login function to hanle user auth
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.header.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      test.error(error.message);
    }
  };
  //   logout function
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logout Successfull");
    socket.dissconnect();
  };

  //   function to update user profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("api.auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile Updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //   Connecting socket functions
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) {
      return;
    }
    const newSocket = io(backend_url, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  //   we have  to execute this function everytime the websits is loaded so we use useEffect
  useEffect(() => {
    if (token) {
      axios.defaults.header.common["token"] = token;
    }
    checkAuth();
  }, []);
  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{Children}</AuthContext.Provider>;
};
