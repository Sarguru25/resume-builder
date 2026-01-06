'use client'

import React, { useEffect, useState } from 'react'
import {
  FilePenLineIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
  UploadCloud,
  LoaderCircleIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import api from '@/app/configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {
  const router = useRouter()

  const colors = ['#9333ea', '#d97706', '#dc2626', '#0284c7', '#16a34a']
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  /* ---------------- LOAD ALL RESUMES ---------------- */
const loadAllResumes = async () => {
  try {
    const res = await fetch("/api/resumes", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to load resumes");

    const data = await res.json();
    setAllResumes(data.resumes);
  } catch (error) {
    toast.error(error.message);
  }
};


  /* ---------------- CREATE RESUME ---------------- */
const createResume = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/resumes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) throw new Error("Failed to create resume");

    const data = await res.json();

    setAllResumes((prev) => [...prev, data.resume]);
    setTitle("");
    setShowCreateResume(false);

    router.push(`/app/builder/${data.resume._id}`);
  } catch (error) {
    toast.error(error.message);
  }
};


  /* ---------------- UPLOAD RESUME (AI) ---------------- */
const uploadResume = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const resumeText = await pdfToText(resume);

    const res = await fetch("/api/ai/upload-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, resumeText }),
    });

    if (!res.ok) throw new Error("Failed to upload resume");

    const data = await res.json();

    setAllResumes((prev) => [...prev, data.resume]);
    setTitle("");
    setResume(null);
    setShowUploadResume(false);

    router.push(`/app/builder/${data.resume._id}`);
  } catch (error) {
    toast.error(error.message);
  } finally {
    setIsLoading(false);
  }
};


  /* ---------------- EDIT RESUME TITLE ---------------- */
const editTitle = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/resumes/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeId: editResumeId,
        resumeData: { title },
      }),
    });

    if (!res.ok) throw new Error("Failed to update title");

    const data = await res.json();

    setAllResumes((prev) =>
      prev.map((r) =>
        r._id === editResumeId ? { ...r, title } : r
      )
    );

    setEditResumeId("");
    setTitle("");
    toast.success(data.message);
  } catch (error) {
    toast.error(error.message);
  }
};

  /* ---------------- DELETE RESUME ---------------- */
const deleteResume = async (resumeId) => {
  if (!window.confirm("Are you sure you want to delete this resume?")) return;

  try {
    const res = await fetch(`/api/resumes/${resumeId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete resume");

    const data = await res.json();

    setAllResumes((prev) => prev.filter((r) => r._id !== resumeId));
    toast.success(data.message);
  } catch (error) {
    toast.error(error.message);
  }
};


  useEffect(() => {
    loadAllResumes()
  }, [])

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>
          Welcome, Joe Doe
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateResume(true)}
            className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover: shadow-1g transition-all duration-300 cursor-pointer'
          >
            <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full' />
            <p className='text-sm group-hover:text-indigo-600 transition-all duration-300'>
              Create Resume
            </p>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-1g transition-all duration-300 cursor-pointer'
          >
            <UploadCloud className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full' />
            <p className='text-sm group-hover:text-purple-600 transition-all duration-300'>
              Upload Existing
            </p>
          </button>
        </div>

        <hr className='border-slate-300 my-6 sm:w-[305px]' />

        <div className='grid grid-cols-2 sm:flex flex-wrap gap-4'>
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length]
            return (
              <button
                key={resume._id}
                onClick={() => router.push(`/app/builder/${resume._id}`)}
                className="group relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + '40',
                }}
              >
                <FilePenLineIcon
                  className='size-7 group-hover:scale-105 transition-all'
                  style={{ color: baseColor }}
                />
                <p
                  className='text-sm group-hover:scale-105 transition-all px-2 text-center'
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>
                <p
                  className='absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center'
                  style={{ color: baseColor + '90' }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1"
                >
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors'
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id)
                      setTitle(resume.title)
                    }}
                    className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors'
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* CREATE MODAL */}
        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'
            >
              <h2 className='text-xl font-bold mb-4'>Create New Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Resume Title"
                className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600'
                required
              />
              <button
                type="submit"
                className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
              >
                Create Resume
              </button>
              <XIcon
                className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'
                onClick={() => {
                  setShowCreateResume(false)
                  setTitle('')
                }}
              />
            </div>
          </form>
        )}

        {/* EDIT MODAL */}
        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId('')}
            className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'
            >
              <h2 className='text-xl font-bold mb-4'>Edit Resume Title</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600'
                required
              />
              <button
                type="submit"
                className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
              >
                Update
              </button>
              <XIcon
                className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'
                onClick={() => {
                  setEditResumeId('')
                  setTitle('')
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Dashboard
