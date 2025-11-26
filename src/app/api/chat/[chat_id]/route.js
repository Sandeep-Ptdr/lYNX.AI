import { chatWithBot } from "@/controllers/chatController";
import { NextResponse } from "next/server";
import Message from "../../models/message";
import { connectDb } from "@/lib/connectDb";
import conversation from "../../models/conversation";

// import user from "../models/user";

export async function POST(req, context = {}) {
  try {
    const params = await context.params;
    const id = params.chat_id;
    //  console.log(id,'id')
    const { question, mode, userId } = await req.json();

    // console.log("modeee", mode, userId, question, id);
    if (!question) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await chatWithBot(
      question,
      id === "new" ? null : id,
      mode,
      userId
    );
    return NextResponse.json({
      success: true,
      response,
      conversationId: response.conversationId,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// /app/api/chat/[chatId]/route.js

export async function GET(req, context = {}) {
  try {
    await connectDb();
    const params = await context.params;
    const id = params.chat_id;
    // console.log('id',id)

    const chat = await Message.find({ conversationId: id }).lean();
    // console.log('chat',chat)
    if (!chat) {
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 }
      );
    }

    const filteredMessages = chat
      ?.filter((m) => m?.role === "user" || m?.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    return NextResponse.json({
      success: true,
      conversationId: id,
      messages: filteredMessages,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
