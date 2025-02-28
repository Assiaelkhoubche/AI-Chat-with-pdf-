"use server"

import { Messages } from "@/types/type";
import { getUser } from "./user"
import connectDB from "@/lib/db";
import { Message } from "@/lib/models/Message";
import { generateLangchainCompletion } from "@/lib/langchain";


export const askQuestion=async( id:string,question:string)=>{
    const user=await getUser();
    if(!user){
        throw new Error("user not authenticated");
    }    
    try{

       await connectDB();
       const reply=await generateLangchainCompletion(id,question);
        console.log("reply:=> ",reply);
        
       const userMessage:Messages={
        role:"ai",
        message:reply!,
        createdAt:new Date(),
        fileId:id,
        userId:user.id,
       }
       const res=await Message.create(userMessage);
       console.log("userMessage:=> ",res);
       return {success:true, message:userMessage};

    }catch(err){
        throw new Error("Failed to ask question");
    }

} 