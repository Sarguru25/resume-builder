import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"
import Resume from "@/lib/models/Resume"
import { calculateATSScore } from "@/lib/atsScore";

export async function POST(req) {
  try {
    await connectDB();

    const { resumeId, role } = await req.json();

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const result = calculateATSScore(resume, role);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}