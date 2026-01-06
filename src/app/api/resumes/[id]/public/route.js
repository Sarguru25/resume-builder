import Resume from "@/../lib/models/Resume"
import { connectDB } from "@/../lib/db"
import { NextResponse } from "next/server"

// GET: /api/resumes/:id/public
export async function GET(req, { params }) {
  await connectDB()

  const resume = await Resume.findOne({
    _id: params.id,
    public: true
  })

  if (!resume) {
    return NextResponse.json({ message: "Resume not found" }, { status: 404 })
  }

  return NextResponse.json({
    message: "Resume fetched successfully",
    resume
  })
}
