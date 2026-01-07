export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const formData = await req.formData()
  const resumeId = formData.get("resumeId")
  const removeBackground = formData.get("removeBackground")
  const resumeDataRaw = formData.get("resumeData")
  const image = formData.get("image")

  let resumeData = typeof resumeDataRaw === "string" ? JSON.parse(resumeDataRaw) : structuredClone(resumeDataRaw)

  // Fix field names
  if (resumeData.accent_color) {
    resumeData.accentColor = resumeData.accent_color
    delete resumeData.accent_color
  }

  // Fix enum capitalization
  if (resumeData.languages) {
    resumeData.languages = resumeData.languages.map(lang => ({
      language: lang.language,
      proficiency:
        lang.proficiency.charAt(0).toUpperCase() +
        lang.proficiency.slice(1).toLowerCase()
    }))
  }

  // Handle image upload
  if (image) {
    const buffer = Buffer.from(await image.arrayBuffer())
    const response = await imagekit.files.upload({
      file: buffer,
      fileName: "user-resumes",
      folder: "user-resumes",
      transformation: {
        pre: "w-300,h-300,fo-face,z-0.75" + (removeBackground === "yes" ? ",e-bgremove" : "")
      }
    })
    resumeData.personal_info.image = response.url
  }

  // Update in DB using $set and runValidators
  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId: session.user.id },
    { $set: resumeData },
    { new: true, runValidators: true }
  )

  if (!resume) {
    return NextResponse.json({ message: "Resume not found or not updated" }, { status: 404 })
  }

  return NextResponse.json({
    message: "Resume updated successfully",
    resume
  })
}
