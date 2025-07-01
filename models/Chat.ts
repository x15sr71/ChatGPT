import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: Array, required: true }, // ChatPart[]
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  chatId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  messages: [MessageSchema],
}, { timestamps: true });

ChatSchema.index({ userId: 1 });

export const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
