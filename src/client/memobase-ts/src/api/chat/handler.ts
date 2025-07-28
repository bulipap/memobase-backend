import { Request, Response } from "express";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { memoBaseClient } from "@/utils/memobase/client";

export async function chatHandler(req: Request, res: Response) {
  try {
    console.log("✅ POST /api/chat triggered");
    console.log("🔧 Incoming /api/chat request:", req.body); // 👈 Added debug log

    const staticUserId = process.env.STATIC_USER_ID;
    if (!staticUserId) throw new Error("Missing STATIC_USER_ID");

    const { messages, tools } = req.body;
    console.log("📥 Body:", messages, tools);

    const user = await memoBaseClient.getOrCreateUser(staticUserId);
    const context = await user.context(750);

    const result = await streamText({
      model: openai(process.env.OPENAI_MODEL || "gpt-4o"),
      messages,
      system: `Use memory:\n${context}`,
      tools,
    });

    const reader = result.textStream.getReader();
    res.setHeader("Content-Type", "text/event-stream");

    for (;;) {
      const { done, value } = await reader.read();
      if (done || value === undefined) break;
      res.write(value, "utf8");
    }

    res.end();

  } catch (err: any) {
    console.error("❌ chatHandler error:", err);
    res.status(500).json({ error: err.message });
  }
}
