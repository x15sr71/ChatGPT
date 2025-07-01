// GET /api/chats
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import { Chat } from "@/models/Chat";
import { NextResponse } from "next/server";

export async function GET() {
    console.log("GET /api/chats called");
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    await dbConnect();

    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .select("chatId title createdAt updatedAt"); // ✅ show chatId, not _id

    return NextResponse.json(chats);
  } catch (err) {
    console.error("[GET /api/chats] Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
