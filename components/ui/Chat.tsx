"use client"

import { Input } from "./input";
import { Button } from "./button";
import { Loader2Icon } from "lucide-react";
import { UserFetched, Messages } from "@/types/type";
import { FormEvent, use, useEffect, useRef, useState, useTransition } from "react";
import axios from "axios";
import { askQuestion } from "@/action/askQuestion";
import ChatMessage from "./ChatMessage";

const Chat = ({id, user}:{id:string, user:UserFetched}) => {

    const [input, setInput] = useState<string>("");
    const [messages, setMessages] = useState<Messages[]>([]);
    const [isPending, startTransition ] = useTransition();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [LoadingContent, setLoadingContent] = useState<boolean>(false);
    const bottomOfChatRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        bottomOfChatRef.current?.scrollIntoView({behavior:"smooth"});
    },[messages]);


    useEffect(()=>{
        fetchMessages();
    },[]);
      

    const fetchMessages=async()=>{
        setLoadingContent(true);
        const res= await axios.get(`/api/chat?fileId=${id}`);
        setMessages(res.data);
        setLoadingContent(false);
    }

    const handleSubmit =async (e:FormEvent) => {
        e.preventDefault();
        if(!input.trim()) return;
        setIsLoading(true);

        try{

            const {data:newMessage}=await axios.post("/api/chat",{
                fileId: id,
                message: input,
                role: "user",
                userId: user.id, 
            });

            setMessages((prev) => [
                ...prev,
                newMessage,
                { message: 'thinking...', role: "ai", createdAt: new Date() }
            ]);
            
            startTransition(async () => {
                const { success, message } = await askQuestion(id, input);
            
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.message === "thinking..."
                            ? success
                                ? message 
                                : { role: "ai", message: `Whoops... ${message}`, createdAt: new Date() }
                            : msg
                    )
                );
            });
            
            
            setInput("");
        }catch(err){
            console.log("Error sending message=>: ", err);
        }finally{
            setIsLoading(false);
        }
    }

  return (
    <div className=" flex flex-col h-full overflow-scroll">
       {/* chat content */}
       <div className="flex-1 p-4 space-y-2 overflow-y-auto">
         
        { LoadingContent?(
            <div>
                <div className="flex items-center justify-center">
                    <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20"/>
                </div>
            </div>
        ):
        (
           
            <div className="p-5">
                {messages.length === 0 && (
                    
                        
                        <ChatMessage 
                                     message={{
                                        role:"ai",
                                        message:"Ask me anything about the document!",
                                        createdAt:new Date(),
                                     }}
                                     user={user}
                                     
                        />
                    
                )}
                {    messages.map((msg, index) => (
                      
                         <ChatMessage key={index} message={msg} user={user}/>
                       
                    ))
                }
               <div ref={bottomOfChatRef}/>
            </div>
            
        )
        }
      </div>

        
        <form onSubmit={handleSubmit}
              className="flex sticky bottom-0 space-x-2 p-5 bg-indigo-600/75"
        >
            <Input value={input} onChange={(e)=>setInput(e.target.value)} 
                    placeholder="Ask anything..."
            />
            <Button type="submit"  disabled={!input || isPending}>
                {isLoading?(
                    <Loader2Icon className="animate-spin text-indigo-600"/>
                ):("Ask")}
            </Button>
        </form>
3
    </div>
  )
}

export default Chat
