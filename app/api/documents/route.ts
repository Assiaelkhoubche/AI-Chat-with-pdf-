import { Document } from "@/lib/models/Document";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getUser } from "@/action/user";

export async function GET(req: Request) {
    const user = await getUser();
   
     if (!user) {
       return NextResponse.json(
         { err: "User not authenticated" },
         { status: 401 }
       );
     }
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId)
      return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const documents = await Document.find({ userId });

    return NextResponse.json({ documents });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
