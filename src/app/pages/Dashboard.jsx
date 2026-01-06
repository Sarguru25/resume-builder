"use client"

import { useEffect, useState } from "react"
import {
  FilePenLineIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
  UploadCloud,
  LoaderCircleIcon
} from "lucide-react"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import pdfToText from "react-pdftotext"

const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState("")
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  /* ---------------- AUTH GUARD (CLIENT) ---------------- */
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  /* ---------------- LOAD RESUMES ---------------- */
  const loadAllResumes = async () => {
    try {
      const res = await fetch("/api/resumes")
      if (!res.ok) throw new Error("Failed to load resumes")
      const data = await res.json()
      setAllResumes(data.resumes)
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      loadAllResumes()
    }
  }, [status])

  /* ---------------- CREATE RESUME ---------------- */
  const createResume = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        body: JSON.stringify({ title }),
        headers: { "Content-Type": "application/json" }
      })

      const data = await res.json()
      setAllResumes(prev => [...prev, data.resume])
      setTitle("")
      setShowCreateResume(false)
      router.push(`/builder/${data.resume._id}`)
    } catch (err) {
      toast.error("Failed to create resume")
    }
  }

  /* ---------------- UPLOAD RESUME ---------------- */
  const uploadResume = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const resumeText = await pdfToText(resume)

      const res = await fetch("/api/ai/upload-resume", {
        method: "POST",
        body: JSON.stringify({ title, resumeText }),
        headers: { "Content-Type": "application/json" }
      })

      const data = await res.json()
      setAllResumes(prev => [...prev, data.resume])
      setTitle("")
      setResume(null)
      setShowUploadResume(false)
      router.push(`/builder/${data.resume._id}`)
    } catch (err) {
      toast.error("Upload failed")
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------------- EDIT TITLE ---------------- */
  const editTitle = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/resumes", {
        method: "PUT",
        body: JSON.stringify({ resumeId: editResumeId, title }),
        headers: { "Content-Type": "application/json" }
      })

      const data = await res.json()
      setAllResumes(prev =>
        prev.map(r => r._id === editResumeId ? { ...r, title } : r)
      )
      setEditResumeId("")
      setTitle("")
      toast.success(data.message)
    } catch {
      toast.error("Update failed")
    }
  }

  /* ---------------- DELETE ---------------- */
  const deleteResume = async (resumeId) => {
    if (!window.confirm("Delete this resume?")) return

    try {
      await fetch(`/api/resumes/${resumeId}`, { method: "DELETE" })
      setAllResumes(prev => prev.filter(r => r._id !== resumeId))
      toast.success("Deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  if (status === "loading") return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-2xl font-medium mb-6">
        Welcome, {session?.user?.name}
      </p>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <button onClick={() => setShowCreateResume(true)} className="card">
          <PlusIcon className="icon" />
          <p>Create Resume</p>
        </button>

        <button onClick={() => setShowUploadResume(true)} className="card">
          <UploadCloud className="icon" />
          <p>Upload Existing</p>
        </button>
      </div>

      <hr className="my-6" />

      {/* RESUME LIST */}
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
        {allResumes.map((resume, index) => {
          const baseColor = colors[index % colors.length]

          return (
            <button
              key={resume._id}
              onClick={() => router.push(`/builder/${resume._id}`)}
              className="resume-card"
              style={{ borderColor: baseColor }}
            >
              <FilePenLineIcon style={{ color: baseColor }} />
              <p>{resume.title}</p>

              <div className="actions">
                <TrashIcon onClick={() => deleteResume(resume._id)} />
                <PencilIcon onClick={() => {
                  setEditResumeId(resume._id)
                  setTitle(resume.title)
                }} />
              </div>
            </button>
          )
        })}
      </div>

      {/* MODALS (Create / Upload / Edit) */}
      {/* ⬅️ Keep same JSX logic you already had (unchanged UI) */}
    </div>
  )
}