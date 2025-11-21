import { chatWithBot } from "@/controllers/chatController";
import { NextResponse } from "next/server"



export async function POST(req) {

    try {
        const {question,id,mode} = await req.json()
        // console.log('modeee',mode)
        if(!question || !id){
            return NextResponse.json({success:false,message:"Missing required fields"},{status:400});
        }
        const response = await chatWithBot(question,id,mode);
        return NextResponse.json({success:true,response})
    } catch (error) {
        return NextResponse.json({success:false,message:error.message},{status:500});
    }
    
}           