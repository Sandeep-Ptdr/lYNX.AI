"use client";

import { Send } from "lucide-react";
import React, { useState, useEffect, useRef, use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatBot } from "@/hooks/useChat";

import toast from "react-hot-toast";
import { ButtonGroupDemo } from "../../components/GroupBtn";
import { useMode } from "@/context/modeContext";
import ChatMessage from "../../components/chat/ChatMessage";
import { useSession } from "next-auth/react";

const ChatPage = () => {
  const { mode } = useMode();
  const session = useSession();

  console.log(session, "ekend");
  const [messageInput, setMessageInput] = useState({
    role: "user",
    query: "",
  });
  // if(!session?.data?.user) return <h1>Unauthorized</h1>

  const [messages, setMessages] = useState([]);
  // console.log('messages',messages)
  const { sendMessage, error } = useChatBot();
  const [showGreeting, setShowGreeting] = useState(true);

  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (messageInput.query.trim() === "") return;
    setShowGreeting(false);

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: messageInput.role, content: messageInput.query },
    ]);

    setMessageInput({ role: "user", query: "" });
    setIsThinking(true);

    // Get reply
    const reply = await sendMessage(
      messageInput.query,
      mode?.mode || "default"
    );

    setIsThinking(false);

    // Add bot reply
    if (reply) {
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full mx-auto container lg:px-40 h-screen flex flex-col justify-between relative bg-[#020618] text-white">
      <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
        {messages.length === 0 && (
          <div className="w-full flex justify-center items-center h-full">
           

            <div className=" p-4 rounded-2xl text-center text-5xl max-w-3xl text-white opacity-80">
              Hello! How can I help you today?
            </div>
          </div>
        )}
        {messages.length > 1 &&
          messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}

        {isThinking && (
          <div className="flex gap-2 mt-2 items-center">
            <Avatar>
              <AvatarImage src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg" />
              <AvatarFallback>🤖</AvatarFallback>
            </Avatar>
            <div className="text-gray-300 p-3 rounded-2xl max-w-[70%]">
              <ThinkingAnimation />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="w-full h-fit bg-[#2e2d2d] p-4 rounded-2xl mb-2 max-w-4xl mx-auto">
        <div className="w-full flex gap-2 ">
          <ButtonGroupDemo />
          <textarea
            name="message"
            onChange={(e) =>
              setMessageInput({ role: "user", query: e.target.value })
            }
            onKeyDown={handleKeyDown}
            value={messageInput.query}
            placeholder="Ask me anything..."
            className="w-full outline-none p-2 resize-none bg-[#1c1b1b] text-white rounded-2xl scrollbar-hide"
          />
          <button
            onClick={handleSend}
            className="cursor-pointer py-2 px-4 rounded-full hover:bg-gray-700 h-fit transition"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

export const ThinkingAnimation = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 text-gray-500 italic ">
      <span className="animate-pulse">Thinking{dots}</span>
    </div>
  );
};
