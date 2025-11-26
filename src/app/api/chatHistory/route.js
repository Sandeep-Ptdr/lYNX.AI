import { connectDb } from "@/lib/connectDb";
import Conversation from "../models/conversation";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
    // console.log('req hit')
    try {
      const session = await getServerSession(authOptions);
    //   console.log('session',session)
      if (!session) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }
        const userId = session.user.id; 

    //  console.log('userId',userId)
    await connectDb();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const conversations = await Conversation.find({ userId }).lean();

    if (!conversations) {
      return NextResponse.json(
        { success: false, message: "No conversations found" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true, conversations }, { status: 200 });
  } catch (error) {
    console.log("error in found conversation", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
