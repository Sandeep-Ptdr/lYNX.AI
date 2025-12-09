// lib/rag/config.js

import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import dotenv from "dotenv";
dotenv.config();  

// Embeddings model
export const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2",
  provider: "hf-inference",
  apiKey: process.env.HUGGINGFACE_API_KEY,
});

// Pinecone client
export const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
});

export const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
