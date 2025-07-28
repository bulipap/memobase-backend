import { Request, Response } from "express";
import { openai } from "@/lib/openai";
import { streamText } from "ai";
import { memoBaseClient } from "@/utils/memobase/client";

export const chatHandler = async (req: Request, res: Response) => {
  try {
    console.log("✅ POST /api/chat triggered");

    const staticUserId = process.env.STATIC_USER_ID;
    if (!staticUserId) throw new Error("Missing STATIC_USER_ID");

    const model = process.env.OPENAI_MODEL!;
    const { messages, tools } = req.body;

    console.log("📥 Received messages:", messages);
    console.log("🔧 Received tools:", tools);

    const user = await memoBaseClient.getOrCreateUser(staticUserId);
    const context = await user.context(750);

    const result = await streamText({
      model: openai(model),
      messages,
      system: `You're Memobase Assistant. Use memory below:\n${context}`,
      tools,
    });

    result.pipe(res); // Stream response to client
  } catch (err: any) {
    console.error("❌ Error in chat handler:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
