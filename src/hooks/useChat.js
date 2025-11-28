



"use client";

 
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());



export const useChatBot = (conversationId) => {
  const isNewChat = !conversationId || conversationId === "new";
const router = useRouter();
  
  const { data, error, isLoading } = useSWR(
    isNewChat ? null : `/api/chat/${conversationId}`,
    fetcher
  );


  const {data:convData, error:convError, isLoading:convLoading,mutate:mutateConversations} = useSWR(
    '/api/chatHistory',
    fetcher
  );

  const messages = data?.messages || [];
  const conversations = convData?.conversations || [];

   
const sendMessage = async (question, mode, userId) => {
  try {
    const isNew = !conversationId || conversationId === "new";

    const url = isNew
      ? `/api/chat/new`
      : `/api/chat/${conversationId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, mode, userId }),
    });

    const result = await response.json();

    if (!result.success) throw new Error(result.message);

   
    if (isNew && result.conversationId) {
      router.push(`/chat/${result.conversationId}`);
      mutate(`/api/chat/${result.conversationId}`);
      mutateConversations();
      return result.response?.reply;
    }

   
    mutate(`/api/chat/${conversationId}`);

    return result.response?.reply;
  } catch (err) {
    console.error("sendMessage error:", err);
    return null;
  }
};




const deleteConversation = async (conversationId) => {
  try {
  const res =  await fetch(`/api/chat/deleteChat`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    // console.log(data)


    mutateConversations(
      current => ({
        ...current,
        conversations: current.conversations.filter(
          (conversation) => conversation._id !== conversationId
        ),
      }),
      false
    )

    mutateConversations();
    return true;
  } catch (err) {
    console.error("deleteConversation error:", err);
    return false;
  }
};



  // expose SWR mutate in case UI wants manual refreshs
  const mutateChat = () => mutate(`/api/chat/${conversationId}`);

  return {
    messages,
    conversations,
    sendMessage,
    mutateChat,
    convLoading :convLoading,
    loadingHistory: isLoading,
    errorMessages: { chatError:error, convError:convError },
    refreshConversations:mutateConversations,
    deleteConversation
  };
};
