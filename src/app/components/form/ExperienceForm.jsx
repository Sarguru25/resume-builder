import { Briefcase, Plus, Sparkles, Trash2, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../../configs/api'
import toast from 'react-hot-toast'

const ExperienceForm = ({ data = [], onChange }) => {

    const { token } = useSelector(state => state.auth)
    const [generatingIndex, setGeneratingIndex] = useState(-1)

    const addExperience = () => {
        const newExperience = {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false
        }
        onChange([...(data || []), newExperience])
    }
    const removeExperience = (index) => {
        const updatedExperiences = (data || []).filter((_, i) => i !== index)
        onChange(updatedExperiences)
    }

    const updateExperience = (index, field, value) => {
        const updatedExperiences = [...(data || [])]
        updatedExperiences[index] = { ...updatedExperiences[index], [field]: value }
        onChange(updatedExperiences)
    }

    const generateExperience = async (index) => {
        setGeneratingIndex(index)
        const experience = data[index]
        const prompt = `enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}`
        try {
            const {data} = await api.post("/api/ai/enhance-job-description", { userContent: prompt }, { headers: { Authorization: `Bearer ${token}` } })
            updateExperience(index, "description", data.resume)
            console.log("AI Response:", data);
        } catch (error) {
            toast.error(error.response.data.message || error.message)
        } finally {
            setGeneratingIndex(-1)
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900 '>Professional Experience</h3>
                    <p className='text-sm text-gray-500'>Add your job experience.</p>
                </div>
                <button onClick={addExperience} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors '>
                    <Plus className='size-4' />
                    Add Experience
                </button>
            </div>

            {(!data || data.length === 0) ? (
                <div className='text-center py-8 text-gray-500 '>
                    <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                    <p>No work experience added yet..</p>
                    <p className='text-sm text-gray-500'>Click on "Add Experience" to add your work experience</p>
                </div>
            ) : (
                <div className='sapce-y-4'>
                    {(data || []).map((experience, index) => (
                        <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                            <div className='flex items-start justify-between'>

                                <h4 className='text-lg font-semibold text-gray-900'>Experience #{index + 1}</h4>
                                <button onClick={() => removeExperience(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                                    <Trash2 className='size-4' />
                                </button>
                            </div>
                            <div className='grid md:grid-cols-2 gap-3'>
                                <input value={experience.company || ""} onChange={(e) => updateExperience(index, "company", e.target.value)} type="text" placeholder='Company Name' className='px-3 py-2 text-sm rounded-lg' />
                                <input value={experience.position || ""} onChange={(e) => updateExperience(index, "position", e.target.value)} type="text" placeholder='Job Title' className='px-3 py-2 text-sm rounded-lg' />
                                <input value={experience.start_date || ""} onChange={(e) => updateExperience(index, "start_date", e.target.value)} type="month" placeholder='Start Date' className='px-3 py-2 text-sm rounded-lg' />
                                <input value={experience.end_date || ""} onChange={(e) => updateExperience(index, "end_date", e.target.value)} type="month" disabled={experience.is_current} placeholder='End Date' className='px-3 py-2 text-sm rounded-lg disabled:text-gray-100' />
                            </div>
                            <label className='flex items-center gap-2'>
                                <input type="checkbox" checked={experience.is_current || false} onChange={(e) => updateExperience(index, "is_current", e.target.checked ? true : false)} className='rounded px-4 py-2 border-gray-300 text-blue-600 focus:ring-blue-500' />
                                <span className='text-sm text-gray-700'>Current working here</span>
                            </label>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700' > Job Description </label>
                                <button onClick={() => generateExperience(index)} disabled={generatingIndex === index || !experience.position || !experience.company} className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                                    {generatingIndex === index ? <Loader2 className='w-3 h-3 animate-spin' /> : (
                                        <Sparkles className='w-3 h-3' />
                                    )}
                                    {generatingIndex === index ? "Generating..." : "Enhance with AI"}
                                </button>
                            </div>
                            <textarea value={experience.description || ""} onChange={(e) => updateExperience(index, "description", e.target.value)} rows={4} className='w-full text-sm px-3 py-2 rounded-lg resize-none' placeholder='Descripe your key responsibilities and achievements...' />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ExperienceForm