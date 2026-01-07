'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

import {
  ArrowLeftIcon,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderIcon,
  Sparkles,
  Award,
  Languages,
  Users,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Share2Icon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react'

import PersonalInfoForm from '@/app/components/form/PersonalInfoForm'
import ProfessionalSummary from '@/app/components/form/ProfessionalSummary'
import ExperienceForm from '@/app/components/form/ExperienceForm'
import EducationForm from '@/app/components/form/EducationForm'
import ProjectForm from '@/app/components/form/ProjectForm'
import SkillForm from '@/app/components/form/SkillForm'
import ParticipationForm from '@/app/components/form/ParticipationsForm'
import AchievementsForm from '@/app/components/form/AchievementsForm'
import LanguagesKnown from '@/app/components/form/LanguagesKnown'
import CustomForm from '@/app/components/form/CustomForm'

import TemplateSecector from '@/app/components/TemplateSecector'
import ResumePreview from '@/app/components/ResumePreview'
import ColorPicker from '@/app/components/ColorPicker'

const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const { data: session, status } = useSession()

  const [resumeData, setResumeData] = useState({
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: [],
    participations: [],
    achievements: [],
    languages: [],
    custom_sections: [],
    template: 'classic',
    accent_color: '#3B82F6',
    public: false,
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'skills', name: 'Skills', icon: Sparkles },
    { id: 'participations', name: 'Participations', icon: Users },
    { id: 'achievements', name: 'Achievements', icon: Award },
    { id: 'languages', name: 'Languages', icon: Languages },
    { id: 'custom', name: 'Custom Sections', icon: LayoutGrid },
  ]
  const activeSection = sections[activeSectionIndex]

  /* ---------------- LOAD RESUME ---------------- */
  useEffect(() => {
    if (!resumeId || status !== 'authenticated') return

    const loadResume = async () => {
      try {
        const res = await fetch(`/api/resumes/${resumeId}`)
        const data = await res.json()

        if (!res.ok) throw new Error(data.message)
        setResumeData(data.resume)
        document.title = data.resume.title
      } catch (err) {
        toast.error(err.message)
      }
    }

    loadResume()
  }, [resumeId, status])

  /* ---------------- SAVE RESUME ---------------- */
const saveResume = async () => {
  const cloned = structuredClone(resumeData)
  const formData = new FormData()

  formData.append("resumeId", resumeId)

  if (typeof cloned.personal_info?.image === "object") {
    delete cloned.personal_info.image
  }

  formData.append("resumeData", JSON.stringify(cloned))

  if (removeBackground) {
    formData.append("removeBackground", "yes")
  }

  if (typeof resumeData.personal_info?.image === "object") {
    formData.append("image", resumeData.personal_info.image)
  }

  const res = await fetch(`/api/resumes/${resumeId}`, {
    method: "PUT",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Failed to save resume")
  }
}


  /* ---------------- PUBLIC / PRIVATE ---------------- */
const togglePublic = async () => {
  try {
    const res = await fetch(`/api/resumes/${resumeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId,
        public: !resumeData.public,
      }),
    })

    if (!res.ok) throw new Error()

    setResumeData(prev => ({
      ...prev,
      public: !prev.public,
    }))

    toast.success("Visibility updated")
  } catch {
    toast.error("Failed to update visibility")
  }
}


  /* ---------------- SHARE & DOWNLOAD ---------------- */
  const handleShare = () => {
    const url = `${window.location.origin}/view/${resumeId}`
    navigator.share
      ? navigator.share({ url, text: 'My resume' })
      : alert(url)
  }

  const handleDownload = () => window.print()

  /* ---------------- AUTH GUARD ---------------- */
  if (status === 'loading') return null
  if (!session) return null

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          href="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* LEFT PANEL */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* Progress bar */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-200"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />

              {/* Section Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex items-center gap-2">
                  <TemplateSecector
                    selectedTemplate={resumeData.template}
                    onChange={template =>
                      setResumeData(prev => ({ ...prev, template }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={color =>
                      setResumeData(prev => ({ ...prev, accent_color: color }))
                    }
                  />
                </div>

                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex(i => Math.max(i - 1, 0))
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setActiveSectionIndex(i =>
                        Math.min(i + 1, sections.length - 1)
                      )
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1 &&
                      'opacity-50'
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
            {activeSection.id === 'personal' && (
              <PersonalInfoForm
                data={resumeData.personal_info}
                onChange={d => setResumeData(p => ({ ...p, personal_info: d }))}
                removeBackground={removeBackground}
                setRemoveBackground={setRemoveBackground}
              />
            )}

            {activeSection.id === 'summary' && (
              <ProfessionalSummary
                data={resumeData.professional_summary}
                onChange={d => setResumeData(p => ({ ...p, professional_summary: d }))}
              />
            )}

            {activeSection.id === 'experience' && (
              <ExperienceForm
                data={resumeData.experience}
                onChange={d => setResumeData(p => ({ ...p, experience: d }))}
              />
            )}

            {activeSection.id === 'education' && (
              <EducationForm
                data={resumeData.education}
                onChange={d => setResumeData(p => ({ ...p, education: d }))}
              />
            )}

            {activeSection.id === 'projects' && (
              <ProjectForm
                data={resumeData.projects}
                onChange={d => setResumeData(p => ({ ...p, projects: d }))}
              />
            )}

            {activeSection.id === 'skills' && (
              <SkillForm
                data={resumeData.skills}
                onChange={d => setResumeData(p => ({ ...p, skills: d }))}
              />
            )}

            {activeSection.id === 'participations' && (
              <ParticipationForm
                data={resumeData.participations}
                onChange={d => setResumeData(p => ({ ...p, participations: d }))}
              />
            )}

            {activeSection.id === 'achievements' && (
              <AchievementsForm
                data={resumeData.achievements}
                onChange={d => setResumeData(p => ({ ...p, achievements: d }))}
              />
            )}

            {activeSection.id === 'languages' && (
              <LanguagesKnown
                data={resumeData.languages}
                onChange={d => setResumeData(p => ({ ...p, languages: d }))}
              />
            )}

            {activeSection.id === 'custom' && (
              <CustomForm
                data={resumeData.custom_sections}
                onChange={d => setResumeData(p => ({ ...p, custom_sections: d }))}
              />
            )}

              <button
                onClick={() =>
                  toast.promise(saveResume(), {
                    loading: 'Saving...',
                    success: 'Resume saved successfully',
                    error: 'Failed to save resume',
                  })
                }
                className="bg-gradient-to-br from-green-100 to-green-200 ring-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2Icon className="size-4" /> Share
                  </button>
                )}
                <button
                  onClick={togglePublic}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors"
                >
                  <DownloadIcon className="size-4" /> Download
                </button>
              </div>
            </div>

            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
