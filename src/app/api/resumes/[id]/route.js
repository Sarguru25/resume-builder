// app/api/resumes/[id]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Resume from "@/lib/models/Resume";  // Updated import to match your new model file
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import imagekit from "@/lib/imageKit";
import mongoose from "mongoose";

// GET: /api/resumes/:id
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Await params (as in your old code)
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid resume ID" }, { status: 400 });
    }

    await connectDB();

    const resume = await Resume.findOne({ _id: id, userId: session.user.id });
    if (!resume) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Resume fetched successfully",
      resume,
    });
  } catch (error) {
    console.error("GET /api/resumes/:id error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE: /api/resumes/:id
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Await params (as in your old code)
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid resume ID" }, { status: 400 });
    }

    await connectDB();

    const deleted = await Resume.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!deleted) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/resumes/:id error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT: /api/resumes/:id
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // ✅ Await params and get resumeId from URL (fixed from old code)
    const { id: resumeId } = await params;
    if (!resumeId || !mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json({ message: "Invalid resume ID" }, { status: 400 });
    }

    let resumeData = {};
    let removeBackground = false;
    let image = null;

    const contentType = req.headers.get("content-type");

    // ---------- HANDLE JSON ----------
    if (contentType?.includes("application/json")) {
      resumeData = await req.json();
      // Remove resumeId if present (no longer needed from body)
      delete resumeData.resumeId;
    }
    // ---------- HANDLE FORMDATA ----------
    else {
      const formData = await req.formData();
      removeBackground = formData.get("removeBackground") === "yes";
      image = formData.get("image");

      const resumeDataRaw = formData.get("resumeData");
      if (resumeDataRaw) {
        resumeData = JSON.parse(resumeDataRaw);
      }
    }

    // ---------- SAFETY: Ensure personal_info exists ----------
    if (!resumeData.personal_info) {
      resumeData.personal_info = {};
    }

    // ---------- IMAGE UPLOAD ----------
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const upload = await imagekit.files.upload({
        file: buffer,
        fileName: "resume-image",
        folder: "user-resumes",
        transformation: {
          pre: "w-300,h-300,fo-face,z-0.75" + (removeBackground ? ",e-bgremove" : ""),
        },
      });

      resumeData.personal_info.image = upload.url;
    }

    // ---------- SAFETY: Ensure skills structure exists ----------
    if (!resumeData.skills) {
      resumeData.skills = { technicalSkills: [], softSkills: [] };
    } else {
      resumeData.skills.technicalSkills = resumeData.skills.technicalSkills || [];
      resumeData.skills.softSkills = resumeData.skills.softSkills || [];
    }

    // ---------- LOG UPDATE DATA ----------
    console.log("Updating resume:", resumeId, resumeData);

    // ---------- UPDATE RESUME ----------
    let resume;
    try {
      resume = await Resume.findOneAndUpdate(
        { _id: resumeId, userId: session.user.id },
        { $set: resumeData },
        { new: true, runValidators: true, upsert: false }
      );
    } catch (mongoError) {
      console.error("Mongo validation error:", mongoError);
      return NextResponse.json({ message: mongoError.message }, { status: 400 });
    }

    if (!resume) {
      return NextResponse.json({ message: "Resume not found or not updated" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error("PUT /api/resumes/:id error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}