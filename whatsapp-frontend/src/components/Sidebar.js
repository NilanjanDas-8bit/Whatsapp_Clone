import React from "react";

function Sidebar({ chats, onSelect, selectedChatId }) {
  return (
    <div className="w-full sm:w-1/3 bg-white border-r overflow-y-auto h-1/2 sm:h-auto">
      <h2 className="text-lg sm:text-xl font-bold p-3 sm:p-4 border-b">Chats</h2>
      {chats.map((chat) => {
        const isSelected = selectedChatId === chat._id;

        return (
          <div
            key={chat._id}
            onClick={() => onSelect(chat)}
            className={`relative p-3 sm:p-4 border-b cursor-pointer transition-all duration-150 ${
              isSelected ? "bg-green-200 font-semibold" : "hover:bg-gray-100"
            }`}
          >
            {isSelected && (
              <div className="absolute left-0 top-0 h-full w-1 bg-green-600"></div>
            )}
            <div
              className={`text-sm sm:text-base break-all ${
                isSelected ? "text-green-900" : "text-black"
              }`}
            >
              {chat._id}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {chat.messages[chat.messages.length - 1]?.message?.slice(0, 30)}...
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
