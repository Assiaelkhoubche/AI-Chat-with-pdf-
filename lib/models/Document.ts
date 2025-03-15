import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    fileSize: { type: Number, required: true },
    content: { type: String, required: true },
    name: { type: String, required: true },
    fileId: { type: String, required: true },
    publicUrl: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Document =
  mongoose.models?.Document || mongoose.model("Document", documentSchema);
