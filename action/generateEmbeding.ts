"use server"

import { gerenerateEmbeddingsInPineConeVectorStore } from "@/lib/langchain";
import { authenticatedUser } from "./user"
import { revalidatePath } from "next/cache";


export const generateEmbeddings =  async(docId:string)=>{
    await authenticatedUser();

    await gerenerateEmbeddingsInPineConeVectorStore(docId);

    revalidatePath("/dashboard");

    return {completed:true}
}



