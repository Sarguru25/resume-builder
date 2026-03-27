import { NextResponse } from "next/server";
import ai from "@/lib/ai";
import { protect } from "@/lib/auth";
import Resume from "@/lib/models/Resume";
import "@/lib/db";

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

    const systemPrompt =
      "You are an expert AI Agent to extract data from resume";

    const userPrompt = `Extract data from the following resume: ${resumeText}
Provide data in the following JSON format with no additional text before or after:
{
  professional_summary: {
    type: String,
    default: ""
  },
  skills: [{
    type: String
  }],
  personal_info: {
    image: {
      type: String,
      default: ""
    },
    full_name: {
      type: String,
      default: ""
    },
    profession: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    linkedin: {
      type: String,
      default: ""
    },
    website: {
      type: String,
      default: ""
    }
  },
  experience: [{
    company: { type: String },
    position: { type: String },
    start_date: { type: String },
    end_date: { type: String },
    description: { type: String },
    is_current: { type: Boolean }
  }],
  project: [{
    name: { type: String },
    type: { type: String },
    description: { type: String }
  }],
  education: [{
    institution: { type: String },
    degree: { type: String },
    field: { type: String },
    graduation_date: { type: String },
    gpa: { type: String }
  }]
}`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    return NextResponse.json(
      {
        message: "Resume enhanced successfully",
        resume: newResume,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}