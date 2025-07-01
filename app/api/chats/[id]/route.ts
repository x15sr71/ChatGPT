// app/api/chats/[id]/route.ts

import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import { Chat } from "@/models/Chat";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    await dbConnect();
    const chat = await Chat.findOne({ userId, chatId: id });
    if (!chat) return new NextResponse("Chat not found", { status: 404 });
    return NextResponse.json(chat);
  } catch (err) {
    console.error(`[GET /api/chats/${id}] Error:`, err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    await dbConnect();
    await Chat.deleteOne({ userId, chatId: id });
    return new NextResponse("Chat deleted", { status: 200 });
  } catch (err) {
    console.error(`[DELETE /api/chats/${id}] Error:`, err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
 
export async function PATCH(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { title } = await req.json();
  if (!title || typeof title !== "string" || title.trim().split(/\s+/).length > 4) {
    return new NextResponse("Invalid title", { status: 400 });
  }

  try {
    await dbConnect();
    const chat = await Chat.findOneAndUpdate(
      { userId, chatId: id },
      { $set: { title: title.trim() } },
      { new: true }
    );
    if (!chat) return new NextResponse("Chat not found", { status: 404 });
    return NextResponse.json(chat);
  } catch (err) {
    console.error(`[PATCH /api/chats/${id}] Error:`, err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
