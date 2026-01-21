'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'

import Loader from '@/app/components/Loader'
import ResumePreview from '@/app/components/ResumePreview'

const Preview = () => {
  const { resumeId } = useParams()
  const router = useRouter()

  const [resumeData, setResumeData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadResume = async () => {
    try {
      const res = await fetch(`/api/resumes/public/${resumeId}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      setResumeData(data.resume)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (resumeId) loadResume()
  }, [resumeId]accent)

  if (isLoading) {
    return <Loader />
  }

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-center text-6xl text-slate-500">
          Resume not found
        </p>

        <button
          onClick={() => router.push('/')}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors"
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          className="py-4 bg-white"
        />
      </div>
    </div>
  )
}

export default Preview
