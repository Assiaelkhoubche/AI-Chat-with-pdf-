"use server"

import bcrypt from 'bcryptjs'
import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";
import { redirect } from 'next/navigation';
import { auth, signIn, signOut } from '@/auth';
import cloudinary from '@/lib/cloudinary';
import { Document } from '@/lib/models/Document';

export const register=async(formData: FormData)=>{

  const userName= formData.get('userName') as string;  
  const email= formData.get('email') as string;
  const password= formData.get('password') as string;
  const gender=formData.get('gender') as string;
  

  const boyProfilePic=`https://avatar.iran.liara.run/public/boy?username=${userName}`;
  const girlProfilePic=`https://avatar.iran.liara.run/public/girl?username=${userName}`;
  
   if(!userName || !email || !password){

     throw new Error("Please fill all fields");

   }
   
    await connectDB();

    const existingUser= await User.findOne({email});
    if(existingUser) throw new Error("User already exists");

    const saltRounds= await bcrypt.genSalt(10);
    const hashPassword= await bcrypt.hash(password, saltRounds);
    const pictureProfile=gender==="male"?boyProfilePic:girlProfilePic
    let success=false;
    try{

      const newUser=await User.create({
        userName,
        email,
        password:hashPassword,
        image:pictureProfile,
        gender
      });
      
      if(newUser){
       console.log("user created");
       success=true;
      }
    }catch(err){

      console.log("Error creating user");

    }

    if(success){
      redirect("/sign-in");
    }
}


export const login= async(formData: FormData)=>{
  const email= formData.get('email') as string;
  const password= formData.get('password') as string;
     
    const res = await signIn("credentials",{
      email,
      password,
      redirect:false,
    });
     
    if (res?.error){
      console.log("Login failed:", res.error);
      return {error: res.error}
    }

    redirect("/dashboard");  
}

export const GitHubLogin=async ()=>{
 await signIn("github",{ redirectTo: "/dashboard" }); 
}

export const GoogleLogin=async ()=>{
  await signIn("google",{ redirectTo: "/dashboard" }); 
}

export const logout= async()=>{
    await signOut({redirect:false});
    redirect("/sign-in")
}


export const getUser=async()=>{
  const session= await auth();

  if(!session){
    throw new Error("Not authenticated");
  }

  if(!session.user || !session.user.id){
    throw new Error("Invalid session");
  }

  return session.user;
}



export const authenticatedUser=async()=>{
  const session=await auth();
  if(!session){
    redirect("/sign-in");
  }
  return session.user;
}




