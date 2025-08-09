import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";

function ChatWindow({ chat, onMessageSent }) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return "✓";
      case "delivered":
        return "✓✓";
      case "read":
        return <span className="text-blue-500">✓✓</span>;
      default:
        return "";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current || {};
    setShowScrollButton(scrollTop + clientHeight < scrollHeight - 50);
  };

  useEffect(() => {
  if (!chat?.messages?.length || !messagesContainerRef.current) return;

  const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;

  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

  if (isNearBottom) {
    scrollToBottom();
  }
}, [chat?.messages]);


  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 relative">
      <div className="bg-white p-4 border-b font-bold">
        Chat with: {chat._id}
      </div>

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
      >
        {chat.messages.map((msg, index) => {
          const isUser = msg.name === "You";
          return (
            <div
              key={index}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-md max-w-xs ${
                  isUser ? "bg-green-100" : "bg-white"
                }`}
              >
                <div>{msg.message}</div>
                <div className="text-xs text-gray-600 flex justify-between items-center mt-1">
                  <span>
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                  {isUser && (
                    <span className="ml-2">
                      {getStatusIcon(msg.status) || msg.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-4 bg-green-300 text-black px-3 py-1 rounded-full shadow-md"
        >
          ↓ Newer Messages
        </button>
      )}

      <MessageInput wa_id={chat._id} onMessageSent={onMessageSent} />
    </div>
  );
}

export default ChatWindow;
