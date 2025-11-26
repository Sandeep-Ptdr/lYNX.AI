// // Lynx — symbol of insight; sharp and adaptive

// import { Groq } from "groq-sdk";

// import { tavily } from "@tavily/core";
// import NodeCache from "node-cache";
// import { GetBotPersonality, getTemperature } from "@/app/api/chat/botModes/botModesUtils";
 

// const groq_api_key = process.env.GROQ_API_KEY;
// const tavily_api_key = process.env.TAVILY_API_KEY;

// // console.log('api key ',groq_api_key,"taivily",tavily_api_key)

// const groq = new Groq({ apiKey: groq_api_key });
// const tvly = new tavily({ apiKey: tavily_api_key });
// const MODEL = "openai/gpt-oss-20b";
// const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); //1 day(24 hours)
// export async function chatWithBot(question, id, mode = "default") {
//   // console.log('mode',mode);

//   try {
//     const cacheKey = `${id}-${mode}`;
     
//     const persona = await GetBotPersonality(mode);
     
//     const temperature = getTemperature(mode);

//     let messages = cache.get(cacheKey) ?? [
//       { role: "system", content: persona },
//     ];
 
//     if (!messages) {
//       messages = [{ role: "system", content: persona }];
//     }

//     messages.push({ role: "user", content: question });

//     const tools = [
//       {
//         type: "function",
//         function: {
//           name: "webSearch",
//           description: "Search the web for latest updates on internet.",
//           parameters: {
//             type: "object",
//             properties: {
//               query: {
//                 type: "string",
//                 description: "The data from the web.",
//               },
//             },
//             required: ["query"],
//           },
//         },
//       },
//     ];

//    const MAX_RETRIES = 10;
//     let retries = 0;

//     while (true) {
//       if(retries >= MAX_RETRIES){
//         return "Failed to get response! Please try again.";
//       }
//       retries++;
//       const Completion = await groq.chat.completions.create({
//         temperature: temperature,
//         messages: messages,
//         tools: tools,
//         tool_choice: "auto",
//         model: MODEL,
//       });

//       const message = Completion.choices[0].message;
//       const toolCalls = message.tool_calls;

//       if (toolCalls) {
//         const availabelFunctions = {
//           webSearch: webSearch,
//         };

//         messages.push(message);

//         for (const tool of toolCalls) {
//           const functionName = tool.function.name;
//           const functionToCall = availabelFunctions[functionName];
//           const functionArgs = JSON.parse(tool.function.arguments);
//           const functionResponse = await functionToCall(functionArgs);

//           messages.push({
//             tool_call_id: tool.id,
//             role: "tool",
//             name: functionName,
//             content: functionResponse,
            
//           });
//         }

//         const Completion2 = await groq.chat.completions.create({
//           model: MODEL,
//           messages: messages,
//           temperature: temperature,
//         });
//         cache.set(cacheKey, messages);
//         // console.log('messages of tool calling',cache.get(cacheKey))
//         return JSON.stringify(Completion2.choices[0].message.content, null, 2);
//       } else {
//         cache.set(cacheKey, messages);
//         //  console.log(JSON.stringify(cache.get(id)),'cache')
//         return message?.content;
//       }
//     }
//   } catch (error) {
//     console.log("chatbot error", error);
//     return "Sorry — I hit a snag while answering. Please try again.";
//   }
// }

// async function webSearch({ query }) {
//   if (!query) return "No query provided";
//   const response = await tvly.search(query);
//   const content = response.results.map((result) => result.content).join("\n\n");
//   return content;
// }










// chatController.js
import { Groq } from "groq-sdk";
import { tavily } from "@tavily/core";

import Conversation from "@/app/api/models/conversation";
import Message from "@/app/api/models/message";
import { GetBotPersonality, getTemperature } from "@/app/api/chat/botModes/botModesUtils";
import { connectDb } from "@/lib/connectDb";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = new tavily({ apiKey: process.env.TAVILY_API_KEY });
const MODEL = "openai/gpt-oss-20b";

/**
 * chatWithBot
 * @param {string} question - user message text
 * @param {string|null} conversationId - existing conversation id or null
 * @param {string} mode - bot mode/personality key
 * @param {string|null} userId - optional user id (ObjectId string) to attach to conversation
 * @returns {Object} { conversationId, reply } or { error }
 */
export async function chatWithBot(question, conversationId = null, mode = "default", userId = null) {
 
  try {
console.log('conver',conversationId)
    await connectDb();

    // 1. Persona + temperature
    const persona = await GetBotPersonality(mode);
    const temperature = getTemperature(mode);

    // 2. Ensure conversation exists
    let conv = null;
    if (!conversationId) {
      conv = await Conversation.create({
        userId: userId || undefined,
        title: question?.slice(0, 60) || "New chat",
      });
      conversationId = conv._id.toString();
    } else {
      conv = await Conversation.findById(conversationId);
      // If conversation not found, create it
      if (!conv) {
        conv = await Conversation.create({
          userId: userId || undefined,
          title: question?.slice(0, 60) || "New chat",
        });
        conversationId = conv._id.toString();
      }
    }

    // 3. Persist user message into DB (role matches your schema enum)
    const userMessage = await Message.create({
      conversationId,
      role: "user",
      content: question,
      metadata: { createdBy: userId || "anonymous" },
    });

    // update conversation updatedAt
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: new Date() });

    // 4. Load recent messages to use as "memory"
    //    We fetch the most recent N messages and then reverse them to chronological order.
    const N = 25;
    let recent = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(N)
      .lean();

    recent = recent.reverse(); // chronological: oldest -> newest

    // 5. Build chat history array for the model.
    //    Use the stored `role` directly: "system" | "user" | "assistant"
    const chatHistory = [
      { role: "system", content: persona },
      ...recent.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // 6. Tools (function-calling) definition — same as before
    const tools = [
      {
        type: "function",
        function: {
          name: "webSearch",
          description: "Search the web for latest updates on internet.",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "search query" },
            },
            required: ["query"],
          },
        },
      },
    ];

    // 7. Call model (single attempt — you can wrap with retry logic if desired)
    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature,
      messages: chatHistory,
      tools,
      tool_choice: "auto",
    });

    const choiceMsg = completion.choices[0].message;
    const toolCalls = choiceMsg?.tool_calls;

    // Helper to persist assistant/tool responses
    async function persistAssistantMessage(content, meta = {}) {
      await Message.create({
        conversationId,
        role: "assistant",
        content,
        metadata: meta,
      });
      await Conversation.findByIdAndUpdate(conversationId, { updatedAt: new Date() });
    }

    // 8. If model requested a tool call (webSearch)
    if (toolCalls && toolCalls.length > 0) {
      // we store the model's tool_call message first (as assistant message with metadata)
      await Message.create({
        conversationId,
        role: "assistant",
        content: choiceMsg.content ?? "", // often empty when tool_calls exist
        metadata: { tool_calls: toolCalls.map((t) => ({ id: t.id, name: t.function.name })) },
      });

      // Execute each tool sequentially and store tool outputs
      for (const tool of toolCalls) {
        const functionName = tool.function.name;
        const args = JSON.parse(tool.function.arguments || "{}");

        let toolResult = "";
        if (functionName === "webSearch") {
          toolResult = await webSearch(args);
        } else {
          toolResult = `No handler for function ${functionName}`;
        }

        // Save tool's output as a system-like entry (we store as assistant role + metadata)
        await Message.create({
          conversationId,
          role: "assistant",
          content: toolResult,
          metadata: {
            isToolOutput: true,
            toolName: functionName,
            toolCallId: tool.id,
            args,
          },
        });

        // Append the tool output into chatHistory so the model can finalize the reply
        chatHistory.push({
          role: "assistant",
          content: toolResult,
        });
      }

      // Ask the model to finalize after tool results
      const completion2 = await groq.chat.completions.create({
        model: MODEL,
        temperature,
        messages: chatHistory,
      });

      const final = completion2.choices[0].message.content;
      await persistAssistantMessage(final, { derivedFromTool: true });

      return { conversationId, reply: final };
    }

    // 9. No tool calls — use model reply directly
    const finalReply = choiceMsg?.content ?? "Sorry, I couldn't generate a response.";
    await persistAssistantMessage(finalReply, {});

    return { conversationId, reply: finalReply };
  } catch (err) {
    console.error("chatWithBot error:", err);
    return { error: "Something went wrong while processing the chat." };
  }
}

/**
 * webSearch - uses Tavily to search and returns joined text
 * @param {{query: string}} param0
 * @returns {string}
 */
async function webSearch({ query }) {
  if (!query) return "No query provided";
  try {
    const response = await tvly.search(query);
    const content = (response.results || []).map((r) => r.content).join("\n\n");
    return content || "No results";
  } catch (e) {
    console.error("webSearch error:", e);
    return "Web search failed";
  }
}
