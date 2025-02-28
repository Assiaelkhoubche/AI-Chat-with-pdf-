import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Document } from "@/lib/models/Document";
import mongoose from "mongoose";
import pdfParse from "pdf-parse";
import { authenticatedUser } from "@/action/user";


export async function POST(req: Request) {

  try {
    await authenticatedUser();
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const fileId=formData.get("fileId") as string;
    const publicUrl=formData.get("publicUrl") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }
 
    const buffer = Buffer.from(await file.arrayBuffer());

    let pdfText = "";
    try {
      const data = await pdfParse(buffer);
      pdfText = data.text;
    } catch (parseError) {
      console.error("PDF Parsing Error:", parseError);
      return NextResponse.json(
        { success: false, error: "Failed to parse PDF content" },
        { status: 400 }
      );
    }
    
    const doc = await Document.create({
      fileSize: file.size,
      userId: new mongoose.Types.ObjectId(userId),
      content: pdfText,
      fileId:fileId,
      publicUrl:publicUrl,
    });

    if (doc) {
      return NextResponse.json({
        success: true,
        message: "PDF uploaded and stored successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to create Document record" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload and store PDF" },
      { status: 500 }
    );
  }
}