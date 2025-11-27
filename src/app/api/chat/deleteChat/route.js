import { NextResponse } from "next/server"
import Conversation from "../../models/conversation";
import { connectDb } from "@/lib/connectDb";
import Message from "../../models/message";




export const DELETE = async (req) => {

    try{


        const {conversationId} = await req.json();
        if(!conversationId){
            return NextResponse.json({success:false,message:"Missing required fields"},{status:400})
        }
        await connectDb();
        await Conversation.findByIdAndDelete(conversationId);
        await Message.deleteMany({conversationId});

        return NextResponse.json({success:true},{status:200})

    }catch(e){
        console.log('Error while deleting the chat',e.message)
        return NextResponse.json({success:false,message:e.message},{status:500})

}

}