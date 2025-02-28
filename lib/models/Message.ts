import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ["user", "ai", "placeholder"],
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  fileId:{ type:String, required: true },
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}

});

export const Message = mongoose.models?.Message || mongoose.model("Message", messageSchema);