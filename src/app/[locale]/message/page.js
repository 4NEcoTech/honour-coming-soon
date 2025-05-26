"use client";
import ChatBox from "@/components/chat-box";
import ChatInput from "@/components/chat-input";
import { useSession } from "next-auth/react";

export default function ChatPage() {
  const { data: session } = useSession();

  const currentUserId = session?.user?.individualId;
  const token = session?.user?.backendToken;

  //  Use correct receiver based on who is logged in
  const receiverId =
    currentUserId === "682040edbcc678ea30210120"
      ? "6820441ddf3ce3b7b231c257"
      : "682040edbcc678ea30210120";

  const sessionId = 1234;

  if (!session || !token) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 border rounded">
      <ChatBox
        currentUserId={currentUserId}
        receiverId={receiverId}
        token={token}
      />
      <ChatInput receiverId={receiverId} sessionId={sessionId} />
    </div>
  );
}
