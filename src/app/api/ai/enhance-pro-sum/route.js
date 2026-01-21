import { NextResponse } from "next/server";
import ai from "@/lib/ai";
import { protect } from "@/lib/auth";

export async function POST(req) {
  try {
    const userId = await protect();
    const { userContent } = await req.json();

    if (!userContent) {
      return NextResponse.json(
        { message: "User content is required" },
        { status: 400 }
      );
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Enhance the professional summary into 1–2 ATS-friendly sentences. Return only text.",
        },
        {
          role: "user",
          content: `Enhance the following resume: ${userContent}`,
        },
      ],
    });

    return NextResponse.json({
      message: "Resume enhanced successfully",
      resume: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("POST /api/ai/enhance-pro-sum error:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 401 }
    );
  }
}
