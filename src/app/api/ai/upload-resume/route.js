import { NextResponse } from "next/server";
import ai from "@/lib/ai";
import { protect } from "@/lib/auth";
import Resume from "@/lib/models/Resume";
import "@/lib/db"; // MongoDB connection

export async function POST(req) {
  try {
    const userId = await protect();
    const { resumeText, title } = await req.json();

    if (!resumeText) {
      return NextResponse.json(
        { message: "Resume text is required" },
        { status: 400 }
      );
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert AI agent to extract structured resume data.",
        },
        {
          role: "user",
          content: `Extract data from the following resume and return valid JSON only:\n${resumeText}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const parsedData = JSON.parse(response.choices[0].message.content);

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    return NextResponse.json({
      message: "Resume uploaded successfully",
      resume: newResume,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}
