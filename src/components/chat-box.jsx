"use client";
import { useEffect, useState } from "react";
import { initSocket, getSocket } from "@/lib/socket";

export default function ChatBox({ currentUserId, receiverId, token }) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const socket = initSocket(token);

    socket.emit("registerUser", currentUserId);
    socket.emit("joinRoom", { senderId: currentUserId, receiverId });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", ({ from }) => {
      if (from === receiverId) setTyping(true);
    });

    socket.on("stopTyping", ({ from }) => {
      if (from === receiverId) setTyping(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col h-[80vh] border rounded p-4 overflow-y-auto">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`p-2 my-1 rounded w-fit max-w-xs ${
            msg.senderId === currentUserId
              ? "bg-blue-100 self-end"
              : "bg-gray-100 self-start"
          }`}
        >
          {msg.text}
        </div>
      ))}
      {typing && <p className="text-sm italic text-gray-500">Typing...</p>}
    </div>
  );
}
