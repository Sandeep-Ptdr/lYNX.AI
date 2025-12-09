

import { PineconeStore } from "@langchain/pinecone";
import { embeddings, pineconeIndex } from "./config.js";

console.log("Loading vector store from existing Pinecone index...");

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

console.log("Vector store ready!");

