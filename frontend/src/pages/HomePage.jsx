import React, { useState } from "react";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";
import RightSideBar from "../components/RightSideBar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);
  useEffect(() => {
    console.log("selected home", selectedUser);
  }, [selectedUser]);
  return (
    <div className="w-full h-screen sm:px-[15%] sm:py-[5%]">
      {console.log("selecteduser", selectedUser)}
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid relative text-white
    grid-cols-1
    ${
      selectedUser
        ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
        : "md:grid-cols-2"
    }`}
      >
        <SideBar />
        <ChatContainer />

        {console.log(selectedUser)}

        {selectedUser && <RightSideBar />}
      </div>
    </div>
  );
};

export default HomePage;
