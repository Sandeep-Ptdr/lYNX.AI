

import { useEffect, useState } from "react";

const greetings = [
  "Hello! How may I assist you today?",
  "Good day! How can I be of service?",
  "Greetings. How may I help you?",
  "Welcome! Please let me know how I can assist.",
  "Hello! How can I support you at this moment?",
  "Hey there! What chaos can I help you solve today?",
  "Hi! Need help, or just here to chat with your favorite AI? 😉",
  "Hello! What mission are we tackling today, partner?",
  "Hey! I’m fully charged and ready—what’s up? ⚡",
  "Hello! How can I be of assistance?",
];

export default function GreetingMessage() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Pick random
    const random = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(random);
  }, []);

  return (
    <div  >
      {greeting}
    </div>
  );
}
