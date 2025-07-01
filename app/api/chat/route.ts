import {
  streamText,
  type CoreMessage,
  type TextPart,
  type ImagePart,
} from "ai";
import { createMem0, retrieveMemories } from "@mem0/vercel-ai-provider";
import { countTokens } from "@/lib/tokenizer";
import dbConnect from "@/lib/db";
import { Chat } from "@/models/Chat";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import OpenAI from "openai";

export const runtime = "nodejs";

const mem0 = createMem0({
  mem0ApiKey: process.env.MEM0_API_KEY!,
  apiKey: process.env.OPENAI_API_KEY!,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function extractText(content: CoreMessage["content"]): string {
  if (!content) return "";
  if (typeof content === "string") return content.trim();
  return (content as TextPart[])
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join(" ")
    .trim();
}

function trimMessages(messages: CoreMessage[], maxTokens = 8000): CoreMessage[] {
  let total = 0;
  const keep: CoreMessage[] = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const tokens = countTokens(extractText(messages[i].content));
    if (total + tokens > maxTokens) break;
    keep.unshift(messages[i]);
    total += tokens;
  }
  return keep;
}

function transformContent(
  role: CoreMessage["role"],
  content: any
): CoreMessage["content"] {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return [{ type: "text", text: "" }];
  return content
    .map((part: any) => {
      if (part.type === "text" && typeof part.text === "string") {
        return { type: "text", text: part.text } as TextPart;
      }
      if (part.type === "image" && typeof part.image?.url === "string") {
        try {
          return { type: "image", image: new URL(part.image.url) } as ImagePart;
        } catch {
          console.warn("[transformContent] Invalid image URL:", part.image.url);
        }
      }
      return null;
    })
    .filter((p): p is TextPart | ImagePart => !!p);
}

function serializeContent(
  content: CoreMessage["content"]
): { type: string; text?: string; image?: { url: string } }[] {
  if (!Array.isArray(content)) return [];

  return content
    .map((part) => {
      if (part.type === "text") {
        return { type: "text", text: part.text };
      }
      if (part.type === "image" && part.image instanceof URL) {
        return { type: "image", image: { url: part.image.toString() } };
      }
      return null;
    })
    .filter(Boolean) as { type: string; text?: string; image?: { url: string } }[];
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const {
    messages: rawMessages,
    chatId,
  }: { messages: CoreMessage[]; chatId: string } = await req.json();

  const generatedChatId = chatId ?? nanoid();

  const transformed = rawMessages.map((m) => ({
    role: m.role,
    content: transformContent(m.role, m.content),
  })) as CoreMessage[];
  const trimmed = trimMessages(transformed);
  const latestUser = [...trimmed].reverse().find((m) => m.role === "user");

  let memoryContext = "";
  try {
    if (latestUser) {
      memoryContext = await retrieveMemories(
        extractText(latestUser.content),
        { user_id: userId }
      );
    }
  } catch (err) {
    console.warn("[mem0] Memory retrieval failed:", err);
  }

  const systemPrompt = [
    "You are a helpful assistant with vision capabilities.",
    "Relevant user memories:",
    memoryContext,
  ].join("\n\n");

  try {
    const result = await streamText({
      model: mem0("gpt-4o", { user_id: userId }),
      system: systemPrompt,
      messages: trimmed,
    });

    let fullAssistantText = "";
    const ts = new TransformStream<Uint8Array, Uint8Array>();
    const writer = ts.writable.getWriter();

    (async () => {
      try {
        for await (const chunk of result.textStream) {
          fullAssistantText += chunk;
          await writer.write(new TextEncoder().encode(chunk));
        }
      } catch (err) {
        console.error("[Stream] Failed to write chunk:", err);
        try {
          await writer.abort(err);
        } catch (abortErr) {
          console.warn("[Stream] Abort failed:", abortErr);
        }
      } finally {
        try {
          await writer.ready;
          await writer.close();
        } catch (closeErr) {
          if (
            !(closeErr instanceof TypeError &&
              closeErr.message.includes("WritableStream is closed"))
          ) {
            console.warn("[Stream] Close failed:", closeErr);
          }
        }
      }

      fullAssistantText = fullAssistantText.trim();

      // 🧠 Generate title
      let aiTitle = "Untitled";
      try {
        const aiMessages = trimmed
          .filter((m) => m.role === "user" || m.role === "assistant" || m.role === "system")
          .map((m) => ({
            role: m.role as "user" | "assistant" | "system",
            content: extractText(m.content),
          }));

        const titleResp = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "Summarize the following conversation in at most 4 words for use as a chat title. Respond with just the title and nothing else.",
            },
            ...aiMessages,
            {
              role: "assistant",
              content: fullAssistantText,
            },
          ],
        });

        const rawTitle = titleResp.choices?.[0]?.message?.content ?? "";
        aiTitle =
          rawTitle
            .trim()
            .split(/\s+/)
            .slice(0, 4)
            .join(" ")
            .replace(/[^\w\s-]/g, "")
            .trim() || "Untitled";
      } catch (titleErr) {
        console.error("[Title] AI title generation failed:", titleErr);
      }

      // 💾 Save to MongoDB
      try {
        await dbConnect();

        const messageHistory = [
          ...(latestUser
            ? [{
                role: latestUser.role,
                content: serializeContent(latestUser.content),
                timestamp: new Date(),
              }]
            : []),
          {
            role: "assistant",
            content: serializeContent([
              { type: "text", text: fullAssistantText },
            ]),
            timestamp: new Date(),
          },
        ];

        await Chat.findOneAndUpdate(
          { userId, chatId: generatedChatId },
          {
            $setOnInsert: {
              title: aiTitle,
              chatId: generatedChatId,
              userId,
            },
            $push: {
              messages: { $each: messageHistory },
            },
            $set: { updatedAt: new Date() },
          },
          { upsert: true }
        );
      } catch (dbErr) {
        console.error("[DB] Save failed:", dbErr);
      }
    })();

    return new Response(ts.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "x-chat-id": generatedChatId,
      },
    });
  } catch (aiErr) {
    console.error("[AI] streamText failed:", aiErr);
    return new Response("AI error", { status: 500 });
  }
}
