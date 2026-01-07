import Resume from "@/../lib/models/Resume"
import { connectDB } from "@/../lib/db"
import { NextResponse } from "next/server"

// GET /api/resumes/public/:resumeId
export async function GET(req, context) {
  await connectDB()

  // Await params before using
  const params = await context.params
  const { resumeId } = params

  const resume = await Resume.findOne({
    _id: resumeId,
    public: true,
  })

  if (!resume) {
    return NextResponse.json(
      { message: "Resume not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    message: "Resume fetched successfully",
    resume,
  })
}
