import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const fetchChats = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/messages/chats");

      const uniqueChatsMap = res.data.reduce((acc, chat) => {
        acc[chat._id] = chat;
        return acc;
      }, {});

      const uniqueChats = Object.values(uniqueChatsMap).sort((a, b) => {
        const aTime = new Date(a.messages[a.messages.length - 1]?.timestamp || 0);
        const bTime = new Date(b.messages[b.messages.length - 1]?.timestamp || 0);
        return bTime - aTime;
      });

      setChats(uniqueChats);

      if (!selectedChatId && uniqueChats.length > 0) {
        setSelectedChatId(uniqueChats[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error.message);
    }
  }, [selectedChatId]);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, [fetchChats]);

  const selectedChat = chats.find((c) => c._id === selectedChatId);

  return (
    <div className="h-screen flex">
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelect={(chat) => setSelectedChatId(chat._id)}
      />
      <ChatWindow chat={selectedChat} onMessageSent={fetchChats} />
    </div>
  );
}

export default App;
