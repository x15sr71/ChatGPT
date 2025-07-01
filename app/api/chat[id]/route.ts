// // GET /api/chats/:id
// import { auth } from "@clerk/nextjs/server";
// import dbConnect from "@/lib/db";
// import { Chat } from "@/models/Chat";
// import { NextResponse } from "next/server";

// interface Params {
//   params: { id: string };
// }

// export async function GET(_: Request, { params }: Params) {
//   console.log("GET /api/chats/[id] called with params:", params);
//   const { userId } = await auth();
//   if (!userId) return new NextResponse("Unauthorized", { status: 401 });

//   try {
//     await dbConnect();

//     const chat = await Chat.findOne({ userId, chatId: params.id }); // ✅ FIXED

//     if (!chat) return new NextResponse("Chat not found", { status: 404 });

//     return NextResponse.json(chat);
//   } catch (err) {
//     console.error(`[GET /api/chats/${params.id}] Error:`, err);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }
