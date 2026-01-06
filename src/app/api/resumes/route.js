import { getServerSession } from "next-auth"
import { authOptions } from "@/../lib/auth"
import Resume from "@/../lib/models/Resume"
import { connectDB } from "@/../lib/db"
import { NextResponse } from "next/server"

// GET: /api/resumes (get all user resumes)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const resumes = await Resume.find({ userId: session.user.id })

  return NextResponse.json({ resumes })
}

// POST: /api/resumes (create resume)
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { title } = await req.json()
  await connectDB()

  const resume = await Resume.create({
    title,
    userId: session.user.id
  })

  return NextResponse.json(
    { message: "Resume created successfully", resume },
    { status: 201 }
  )
}
