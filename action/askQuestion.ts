"use server";
import { Messages } from "@/types/type";
import { getUser } from "./user";
import connectDB from "@/lib/db";
import { Message } from "@/lib/models/Message";
import { generateLangchainCompletion } from "@/lib/langchain";
import { Document } from "@/lib/models/Document";

export const askQuestion = async (id: string, question: string) => {
  const user = await getUser();
  if (!user) {
    throw new Error("user not authenticated");
  }
  try {
    await connectDB();

    const existingMessage = await Message.find({ fileId: id, userId: user.id });
    const userDocuments = await Document.find({ userId: user.id });

    if (!user.hasAciveMembership && existingMessage.length >= 2) {
      console.log("it's Free");
      return {
        success: false,
        message:
          "You have reached the limit of free documents. Please upgrade to PRO to ask more questions.",
      };
    }

    if (user.hasAciveMembership && existingMessage.length >= 20) {
      console.log("it's Pro");
      return {
        success: false,
        message:
          "You have reached the limit of free documents. Please upgrade to PRO to ask more questions.",
      };
    }

    const reply = await generateLangchainCompletion(id, question);
    console.log("reply:=> ", reply);

    const userMessage: Messages = {
      role: "ai",
      message: reply!,
      createdAt: new Date(),
      fileId: id,
      userId: user.id,
    };
    const res = await Message.create(userMessage);
    console.log("userMessage:=> ", res);
    return { success: true, message: "hello assia" };
  } catch (err) {
    throw new Error("Failed to ask question");
  }
};
