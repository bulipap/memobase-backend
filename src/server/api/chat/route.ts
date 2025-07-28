// src/server/api/chat/route.ts

import { openai } from "@/lib/openai";
import { streamText } from "ai";
import { memoBaseClient } from "@/utils/memobase/client";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log("✅ POST /api/chat triggered");

    const staticUserId = process.env.STATIC_USER_ID;
    if (!staticUserId) throw new Error("Missing STATIC_USER_ID");

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) throw new Error("Missing OPENAI_API_KEY");

    const model = process.env.OPENAI_MODEL;
    if (!model) throw new Error("Missing OPENAI_MODEL");

    const body = await req.json();
    const { messages, tools } = body;
    console.log("📥 Request body parsed:", JSON.stringify(body, null, 2));

    const user = await memoBaseClient.getOrCreateUser(staticUserId);
    const context = await user.context(750);
    console.log("🧠 Retrieved context memory");

    const result = await streamText({
      model: openai(model),
      messages,
      system: `You're Memobase Assistant. Use memory below:\n${context}`,
      tools,
    });

    return result;
  } catch (err: any) {
    console.error("❌ Error in /api/chat:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  return new Response("Only POST is supported", { status: 405 });
}
