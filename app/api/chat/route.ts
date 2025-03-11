import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Message } from "@/lib/models/Message";
import { getUser } from "@/action/user";
import mongoose from "mongoose";

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
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json({ err: "File ID is required" }, { status: 400 });
    }

    const messages = await Message.find({
      fileId: fileId,
      userId: user.id,
    }).sort({ createdAt: 1 });
    return NextResponse.json(messages, { status: 200 });
  } catch (e) {
    return NextResponse.json({ err: e }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json(
      { err: "User not authenticated" },
      { status: 401 }
    );
  }
  try {
    await connectDB();
    const body = await req.json();
    const { fileId, message, role, userId } = body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId:", userId, typeof userId);
      return NextResponse.json(
        { err: "Invalid userId format" },
        { status: 400 }
      );
    }

    if (!fileId || !message || !role || !userId) {
      return NextResponse.json(
        { err: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      fileId,
      message,
      role,
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (!newMessage) {
      return NextResponse.json(
        { err: "Failed to create message in the database" },
        { status: 500 }
      );
    }
    return NextResponse.json(newMessage, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { err: "Failed to send message" },
      { status: 500 }
    );
  }
}
