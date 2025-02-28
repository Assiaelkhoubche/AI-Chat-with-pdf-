"use client"
import { getUser } from "@/action/user";
import { UserContextType, UserFetched } from "@/types/type";
import { createContext, useContext, useEffect, useState } from "react";


const UserContext=createContext<UserContextType | undefined>(undefined)

export const UserProvider=({children}:{children:React.ReactNode})=>{

    const [user, setUser]= useState<UserFetched | null>(null);

    useEffect(()=>{
        fetchUserInfo();
    },[]);

    const fetchUserInfo=async()=>{
        const res= await getUser();
        setUser(res);
       
    }
  

    return (
        <UserContext.Provider value={{user, fetchUserInfo}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser=()=>{
    const context=useContext(UserContext);
    
    if(!context){
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
}