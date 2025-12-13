// "use client";

// import { Send } from "lucide-react";
// import React, { useState, useEffect, useRef, use } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useChatBot } from "@/hooks/useChat";
// import { ButtonGroupDemo } from "../../../components/GroupBtn";
// import { useMode } from "@/context/modeContext";
// import ChatMessage from "../../../components/chat/ChatMessage";
// import { useSession } from "next-auth/react";

// const ChatPage = ({ params }) => {
//   const { mode } = useMode();
//   const resolvedChatId = use(params)
//   const {chat_id} = resolvedChatId
//   const { data: session } = useSession();
//   const userId = session?.user?.id;

//   const {
//     messages: historyMessages,
//     sendMessage,
//     loadingHistory,
//   } = useChatBot(chat_id);

//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState({ role: "user", query: "" });
//   const [isThinking, setIsThinking] = useState(false);

//   const messagesEndRef = useRef(null);

//   // Load previous chat messages when API returns them
//   useEffect(() => {
//     if (!loadingHistory && historyMessages.length > 0) {
//       setMessages(historyMessages);
//     }
//   }, [historyMessages, loadingHistory]);

//   // Auto-scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async () => {
//     if (messageInput.query.trim() === "") return;

//     // Add user message instantly
//     setMessages((prev) => [
//       ...prev,
//       { role: "user", content: messageInput.query },
//     ]);

//     const userText = messageInput.query;
//     setMessageInput({ role: "user", query: "" });

//     setIsThinking(true);

//     // Send to API
//     const reply = await sendMessage(
//       userText,
//       mode?.mode || "default",
//       userId
//     );

//     setIsThinking(false);

//     // Show assistant response
//     if (reply) {
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: reply },
//       ]);
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="w-full mx-auto container lg:px-40  h-screen flex flex-col justify-between relative bg-[#020618] text-white">
//       <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">

//         {/* Greeting when no messages */}
//         {messages.length === 0 && (
//           <div className="w-full flex justify-center items-center h-full">
//             <div className="p-4 rounded-2xl text-center md:text-5xl text-2xl w-auto md:max-w-3xl text-white opacity-80">
//               Hello! How can I help you today?
//             </div>
//           </div>
//         )}

//         {/* Render history + new messages */}
//         {messages.length > 0 &&
//           messages.map((message, index) => (
//             <ChatMessage
//               key={index}
//               role={message.role}
//               content={message.content}
//             />
//           ))}

//         {/* Thinking animation */}
//         {isThinking && (
//           <div className="flex gap-2 mt-2 items-center">
//             <Avatar>
//               <AvatarImage src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg" />
//               <AvatarFallback>🤖</AvatarFallback>
//             </Avatar>
//             <div className="text-gray-300 p-3 rounded-2xl max-w-[70%]">
//               <ThinkingAnimation />
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Box */}
//       <div className="w-full h-fit    mb-2 md:max-w-4xl mx-auto pr-4">
//         <div className="w-full flex gap-2 p-4  rounded-2xl  bg-[#0F172B] ">
//           <ButtonGroupDemo />
//           <textarea
//             name="message"
//             onChange={(e) =>
//               setMessageInput({ role: "user", query: e.target.value })
//             }
//             onKeyDown={handleKeyDown}
//             value={messageInput.query}
//             placeholder="Ask me anything..."
//             className="w-full outline-none p-2 resize-none bg-[#0F172B] text-white rounded-2xl scrollbar-hide"
//           />
//           <button
//             onClick={handleSend}
//             className="cursor-pointer py-2 px-4 rounded-full hover:bg-gray-700 h-fit transition"
//           >
//             <Send />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

// export const ThinkingAnimation = () => {
//   const [dots, setDots] = useState("");

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDots((prev) => (prev.length < 3 ? prev + "." : ""));
//     }, 400);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex items-center space-x-2 text-gray-500 italic ">
//       <span className="animate-pulse">Thinking{dots}</span>
//     </div>
//   );
// };
"use client";

import { Send, Mic, MicOff, Volume2, Square } from "lucide-react";
import React, { useState, useEffect, useRef, use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatBot } from "@/hooks/useChat";
// import { ButtonGroupDemo } from "../../../components/GroupBtn";
import { useMode } from "@/context/modeContext";
import ChatMessage from "../../../components/chat/ChatMessage";
import { useSession } from "next-auth/react";

// speech hooks
import { useSpeech } from "@/hooks/useSpeech";
import { useSpeechInput } from "@/hooks/useSpeechInput";
import GreetingMessage from "@/app/components/GreetingMsgs";
import { Button } from "@/components/ui/moving-border";
import { BackgroundBeams } from "@/components/ui/background-beams";
const ChatPage = ({ params }) => {
  const { mode } = useMode();
  const resolvedChatId = use(params);
  const { chat_id } = resolvedChatId;
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    messages: historyMessages,
    sendMessage,
    loadingHistory,
  } = useChatBot(chat_id);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState({ role: "user", query: "" });
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef(null);

  // text-to-speech
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeech();

  // speech-to-text
  const { transcript, interimTranscript, isListening, toggleListening } =
    useSpeechInput({
      continuous: false,
      interimResults: true,
      lang: "en-US",
    });

  // this stores which message is being spoken
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);

  // when voice stops talking, clear the speaking id
  useEffect(() => {
    if (!isSpeaking) {
      setCurrentSpeakingId(null);
    }
  }, [isSpeaking]);

  // load old messages
  useEffect(() => {
    if (!loadingHistory && historyMessages.length > 0) {
      setMessages(historyMessages);
    }
  }, [historyMessages, loadingHistory]);

  // always scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // show speech text while talking
  useEffect(() => {
    if (isListening && interimTranscript) {
      setMessageInput((prev) => ({ ...prev, query: interimTranscript }));
    }
  }, [interimTranscript, isListening]);

  // put final speech text in input
  useEffect(() => {
    if (!isListening && transcript) {
      setMessageInput({ role: "user", query: transcript });
    }
  }, [transcript, isListening]);

  // send user message
  const handleSend = async () => {
    if (messageInput.query.trim() === "") return;

    // show user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: messageInput.query },
    ]);

    const userText = messageInput.query;
    setMessageInput({ role: "user", query: "" });

    setIsThinking(true);

    // send to API
    const reply = await sendMessage(userText, mode?.mode || "default", userId);

    setIsThinking(false);

    // show bot reply
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

  const prompts = [
    "Hey there! 👋 What’s your name?",
    // "Let’s get colorful 🎨—what’s your favorite color?",
    // "Quick quiz 🧠: do you know the capital of France?",
    // "Space time! 🚀 Which planet is the biggest in our solar system?",
    "Who are you?",
    // "If you could have any superpower, what would it be? 🦸",
    "Coffee or tea? ☕🍵 Pick your potion!",
    // "What’s a song you can’t stop listening to right now? 🎵",
    // "Beach or mountains? 🏖️🏔️ Which one’s your vibe?",
    "Tell me one fun fact about yourself! 😄",
  ];

  return (
    <div className="w-full mx-auto container lg:px-40 h-screen flex flex-col justify-between relative bg-[#020618] text-white">
      <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
        {/* show greeting when there are no messages */}
        {messages.length === 0 && (
          <div className="w-full flex justify-center items-center h-full">
            <div className="w-full flex flex-col justify-center items-center h-full">
              <div className="p-4 rounded-2xl text-center md:text-3xl text-2xl w-auto md:max-w-3xl text-gray-200 opacity-80">
                <GreetingMessage />
              </div>
              <div className="flex justify-center max-w-full flex-wrap gap-3 mt-3">
                {prompts.map((prompt, index) => (
                  <Button
                  containerClassName="w-auto"
                  className='px-4'
                    onClick={() =>
                      setMessageInput({ role: "user", query: prompt })
                    }
                    key={index}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* show chat messages */}
        {messages.length > 0 &&
          messages.map((message, index) => (
            <div key={index} className="mb-2">
              <ChatMessage role={message.role} content={message.content} />

              {/* speak buttons only for bot messages */}
              {message.role === "assistant" && message.content && (
                <div className="flex items-center gap-2 mt-1 ml-4">
                  <button
                    onClick={() => {
                      // stop if speaking now
                      if (currentSpeakingId === index) {
                        stopSpeaking();
                        setCurrentSpeakingId(null);
                        return;
                      }

                      // start speaking this message
                      stopSpeaking();
                      speak(message.content);
                      setCurrentSpeakingId(index);
                    }}
                    className="flex items-center gap-2 text-xs text-gray-300 px-3 py-1 rounded-full hover:bg-gray-800 transition"
                  >
                    {currentSpeakingId === index ? (
                      <>
                        <Square className="w-4 h-4" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Speak
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}

        {/* thinking animation when bot is loading */}
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

      {/* chat input area */}
      <div className="w-full mb-2 md:max-w-4xl mx-auto pr-4">
        <div className="w-full flex items-end gap-2 p-4 rounded-2xl bg-[#0F172B]">
          {/* mic button */}
          <button
            onClick={() => toggleListening()}
            className={`p-2 rounded-full border flex justify-center items-center ${
              isListening ? "bg-red-500" : "hover:bg-accent"
            }`}
            style={{ width: "48px", height: "48px" }}
          >
            {!isListening ? (
              <Mic size={20} />
            ) : (
              <div className="flex items-end gap-[3px]">
                <span className="w-1.5 h-3 bg-white rounded-full animate-pulse"></span>
                <span className="w-1.5 h-5 bg-white rounded-full animate-pulse"></span>
                <span className="w-1.5 h-3 bg-white rounded-full animate-pulse"></span>
              </div>
            )}
          </button>
          {/* typing box */}
          <div className="relative flex-1">
            <textarea
              onChange={(e) =>
                setMessageInput({ role: "user", query: e.target.value })
              }
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={handleKeyDown}
              value={messageInput.query}
              placeholder="Ask me anything..."
              rows={1}
              className="
                w-full 
                outline-none 
                p-3
                resize-none 
                bg-[#0F172B] 
                text-white 
                rounded-2xl
                max-h-40          
                overflow-y-auto
                hide-scrollbar    
                
                min-h-[42px]
                 "
            />
          </div>
          {/* send button */}
          <button
            onClick={handleSend}
            className="p-2 h-fit cursor-pointer rounded-[6px] hover:bg-gray-700 border"
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
    <div className="flex items-center space-x-2 text-gray-500 italic">
      <span className="animate-pulse">Thinking{dots}</span>
    </div>
  );
};
