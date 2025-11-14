import { useState } from "react";

const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8); //for unique id to help in caching at server side
export const useChatBot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (question,mode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, id,mode }),
      });

      const data = await response.json();
      if (!data.success) {
        // console.log('error',data.message)
        throw new Error(data?.message || "Failed to get response");
      }
      return data?.response;
    } catch (e) {
      // console.log(error,'eee')
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
};
