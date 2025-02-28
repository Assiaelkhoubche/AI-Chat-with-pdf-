
import { Messages, UserFetched } from '@/types/type'
import React from 'react'
import Markdown from 'react-markdown';
import Image from 'next/image';
import { BotIcon,  Loader2Icon } from 'lucide-react';

const ChatMessage = ({message, user}:{message:Messages, user:UserFetched}) => {
    const isHuman=message.role === "user";

  return (
    <div className={`chat ${isHuman ? "chat-end" : "chat-start"}`}>
        <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
                {isHuman?(
                    user?.image &&(
                        <Image
                            src={user.image}
                            alt="profile picture"
                            width={40}
                            height={40}
                            className=" rounded-full"
                        />
                    )
                ):(
                      <div className="h-10 w-10 flex items-center justify-center bg-indigo-600 rounded-full">
                            <BotIcon className="text-white h-6 w-6" />
                      </div>
                )}
            </div>
        </div>

        <div className={`chat-bubble prose ${isHuman && "bg-indigo-600 text-white"} `}>
               {message.message==="thinking..."?(
                   <div className="flex items-center justify-center ">
                        <Loader2Icon className="animate-spin h-10 w-10 text-white mt-2"/>
                    </div>
               ):(
                 <Markdown>{message.message}</Markdown>
               )
               } 
        </div>
    </div>
  )
}

export default ChatMessage