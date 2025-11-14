// Lynx — symbol of insight; sharp and adaptive

import { Groq } from "groq-sdk";

import { tavily } from "@tavily/core";
import NodeCache from "node-cache";
import { GetBotPersonality, getTemperature } from "@/app/api/chat/botModes/botModesUtils";
 

const groq_api_key = process.env.GROQ_API_KEY;
const tavily_api_key = process.env.TAVILY_API_KEY;

// console.log('api key ',groq_api_key,"taivily",tavily_api_key)

const groq = new Groq({ apiKey: groq_api_key });
const tvly = new tavily({ apiKey: tavily_api_key });
const MODEL = "openai/gpt-oss-20b";
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); //1 day(24 hours)
export async function chatWithBot(question, id, mode = "default") {
  // console.log('mode',mode);

  try {
    const cacheKey = `${id}-${mode}`;
     
    const persona = await GetBotPersonality(mode);
     
    const temperature = getTemperature(mode);

    let messages = cache.get(cacheKey) ?? [
      { role: "system", content: persona },
    ];
 
    if (!messages) {
      messages = [{ role: "system", content: persona }];
    }

    messages.push({ role: "user", content: question });

    const tools = [
      {
        type: "function",
        function: {
          name: "webSearch",
          description: "Search the web for latest updates on internet.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The data from the web.",
              },
            },
            required: ["query"],
          },
        },
      },
    ];

   const MAX_RETRIES = 10;
    let retries = 0;

    while (true) {
      if(retries >= MAX_RETRIES){
        return "Failed to get response! Please try again.";
      }
      retries++;
      const Completion = await groq.chat.completions.create({
        temperature: temperature,
        messages: messages,
        tools: tools,
        tool_choice: "auto",
        model: MODEL,
      });

      const message = Completion.choices[0].message;
      const toolCalls = message.tool_calls;

      if (toolCalls) {
        const availabelFunctions = {
          webSearch: webSearch,
        };

        messages.push(message);

        for (const tool of toolCalls) {
          const functionName = tool.function.name;
          const functionToCall = availabelFunctions[functionName];
          const functionArgs = JSON.parse(tool.function.arguments);
          const functionResponse = await functionToCall(functionArgs);

          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: functionResponse,
            
          });
        }

        const Completion2 = await groq.chat.completions.create({
          model: MODEL,
          messages: messages,
          temperature: temperature,
        });
        cache.set(cacheKey, messages);
        // console.log('messages of tool calling',cache.get(cacheKey))
        return JSON.stringify(Completion2.choices[0].message.content, null, 2);
      } else {
        cache.set(cacheKey, messages);
        //  console.log(JSON.stringify(cache.get(id)),'cache')
        return message?.content;
      }
    }
  } catch (error) {
    console.log("chatbot error", error);
    return "Sorry — I hit a snag while answering. Please try again.";
  }
}

async function webSearch({ query }) {
  if (!query) return "No query provided";
  const response = await tvly.search(query);
  const content = response.results.map((result) => result.content).join("\n\n");
  return content;
}
