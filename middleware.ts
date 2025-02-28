import {auth} from "@/auth"
import { NextResponse } from "next/server";


export default auth((req)=>{

    const protectedRoutes=["/dashboard"];

    if(protectedRoutes.some((route)=>req.nextUrl.pathname.startsWith(route))){
        if(!req.auth){
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }
    }
    return NextResponse.next();
})

