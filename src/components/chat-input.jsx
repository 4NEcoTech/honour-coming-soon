"use client";
import { useState } from "react";
import { getSocket } from "@/lib/socket";

export default function ChatInput({ receiverId, sessionId }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    const socket = getSocket();
    socket.emit("sendMessage", {
      receiverId,
      text,
      sessionId,
    });

    setText("");
  };

  return (
    <div className="flex gap-2 p-4 border-t">
      <input
        type="text"
        className="flex-1 border rounded px-4 py-2"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}
