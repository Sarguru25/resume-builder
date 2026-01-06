import { getServerSession } from "next-auth"
import { authOptions } from "@/../lib/auth"
import Resume from "@/../lib/models/Resume"
import { connectDB } from "@/../lib/db"
import imagekit from "@/../lib/imageKit"
import fs from "fs"
import { NextResponse } from "next/server"

// PUT: /api/resumes/update
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
