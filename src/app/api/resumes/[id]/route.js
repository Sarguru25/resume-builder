// app/api/resumes/[id]/route.js
import { getServerSession } from "next-auth"
import { authOptions } from "@/../lib/auth"
import Resume from "@/../lib/models/Resume"
import { connectDB } from "@/../lib/db"
import { NextResponse } from "next/server"
import imagekit from "@/../lib/imageKit"
import mongoose from "mongoose"

// GET: /api/resumes/:id
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // ✅ Await params
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid resume ID" }, { status: 400 })
    }

    await connectDB()

    const resume = await Resume.findOne({ _id: id, userId: session.user.id })
    if (!resume) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Resume fetched successfully",
      resume
    })
  } catch (error) {
    console.error("GET /api/resumes/:id error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

// DELETE: /api/resumes/:id
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // ✅ Await params
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid resume ID" }, { status: 400 })
    }

    await connectDB()

    const deleted = await Resume.findOneAndDelete({
      _id: id,
      userId: session.user.id
    })

    if (!deleted) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Resume deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/resumes/:id error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const resumeId = formData.get("resumeId")
  const removeBackground = formData.get("removeBackground")
  const resumeDataRaw = formData.get("resumeData")
  const image = formData.get("image")

  let resumeData =
    typeof resumeDataRaw === "string"
      ? JSON.parse(resumeDataRaw)
      : structuredClone(resumeDataRaw)

  if (image) {
    const buffer = Buffer.from(await image.arrayBuffer())

    const response = await imagekit.files.upload({
      file: buffer,
      fileName: "user-resumes",
      folder: "user-resumes",
      transformation: {
        pre:
          "w-300,h-300,fo-face,z-0.75" +
          (removeBackground === "yes" ? ",e-bgremove" : "")
      }
    })

    resumeData.personal_info.image = response.url
  }

  await connectDB()

  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId: session.user.id },
    resumeData,
    { new: true }
  )

  return NextResponse.json({
    message: "Resume updated successfully",
    resume
  })
}
