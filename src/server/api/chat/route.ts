// src/server/api/chat/route.ts

import { openai } from "@/lib/openai";
import { streamText } from "ai";
import { memoBaseClient } from "@/utils/memobase/client";

export const maxDuration = 30;

export async function POST(req: Request) {
  const staticUserId = process.env.STATIC_USER_ID;
  if (!staticUserId) {
    console.error("Missing STATIC_USER_ID");
    return new Response("Missing STATIC_USER_ID", { status: 500 });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY");
    return new Response("Missing OPENAI_API_KEY", { status: 500 });
  }

  try {
    const user = await memoBaseClient.getOrCreateUser(staticUserId);
    const context = await user.context(750);
    const { messages, tools } = await req.json();

    const result = await streamText({
      model: openai(process.env.OPENAI_MODEL!),
      messages,
      system: `You're Memobase Assistant. Use the memory below:\n${context}`,
      tools,
    });

    return result;
  } catch (err) {
    console.error("Chat route error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
