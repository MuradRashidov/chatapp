import React from "react";
import { useChat } from "../store/useChat";
import Sidebar from "../companents/Sidebar";
import NoChat from "../companents/NoChat";
import ChatContainer from "../companents/ChatContainer";
const Home = () => {
  const { selectedUser } = useChat();
  return (
    <div className="h-screen w-full bg-base-200">
      <div className="flex w-full items-center justify-center pt-20 px-40">
        <div className="bg-base-100 rounded-lg shadow-xl w-[100vw]  h-[calc(100vh-8rem)]">
          <div className="w-[100vw]  flex rounded-md">
            <Sidebar />
            {!selectedUser ? <NoChat /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
