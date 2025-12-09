// lib/rag/ingest.js

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { embeddings, pineconeIndex } from "./config.js";
import dotenv from "dotenv";
dotenv.config();


import fs from "fs";
import path from "path";

// Path to the PDF (inside /public)
const PDF_PATH = path.join(
  process.cwd(),
  "public",
  "Traffic_rules.pdf"
);

// Flag to prevent re-ingestion
const FLAG_FILE = path.join(process.cwd(), ".pdf_ingested.flag");

export async function ingestPDF() {
  try {
    if (fs.existsSync(FLAG_FILE)) {
      console.log("PDF already ingested, skipping...");
      return;
    }

    console.log("📄 Loading PDF:", PDF_PATH);

    const loader = new PDFLoader(PDF_PATH, { splitPages: false });
    const docs = await loader.load();

    console.log("Splitting into chunks...");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });

    const chunks = await splitter.splitText(docs[0].pageContent);

    const documents = chunks.map((chunk) => ({
      pageContent: chunk,
      metadata: docs[0].metadata,
    }));

    console.log(`📈 Embedding & uploading ${documents.length} chunks...`);

    await PineconeStore.fromDocuments(documents, embeddings, {
      pineconeIndex,
    });

    fs.writeFileSync(FLAG_FILE, "done");
    console.log("PDF ingestion complete! Stored in Pinecone.");
  } catch (err) {
    console.error("Error during ingestion:", err);
  }
}

// Allow running: node lib/rag/ingest.js
// ingestPDF();
