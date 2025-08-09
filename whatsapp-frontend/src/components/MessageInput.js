import React, { useState } from "react";
import axios from "axios";

function MessageInput({ wa_id, onMessageSent }) {
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/messages/send", {
        wa_id,
        name: "You",
        message: text,
      });

      setText("");

      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error("Message send failed:", error);
    }
  };

  return (
    <div className="p-2 sm:p-4 bg-white border-t flex gap-2 items-center">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        placeholder="Type a message"
        className="flex-1 border rounded px-3 py-2 text-sm sm:text-base"
      />
      <button
        onClick={sendMessage}
        className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
