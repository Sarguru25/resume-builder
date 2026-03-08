'use client'

import React from "react"
import {
  ChevronLeft,
  ChevronRight,
  EditIcon
} from "lucide-react"

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

import TemplateSelector from '@/app/components/left-panel/TemplateSelector'
import TypographySettings from '@/app/components/left-panel/TypographySettings'
import ColorPicker from '@/app/components/left-panel/ColorPicker'

const LeftPanel = ({
  resumeData,
  setResumeData,
  activeSection,
  activeSectionIndex,
  setActiveSectionIndex,
  sections,
  removeBackground,
  setRemoveBackground,
  showTypographySettings,
  setShowTypographySettings,
  sectionTypographies,
  selectedTypographySection,
  setSelectedTypographySection,
  updateTypography,
  saveResume,
  toast
}) => {

  return (
    <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">

        {/* Progress Bar */}
        <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
        <hr
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-200"
          style={{
            width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
          }}
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">

          {/* <div className="flex items-center gap-2">
            <TemplateSelector
              selectedTemplate={resumeData.template}
              onChange={(template) =>
                setResumeData(prev => ({ ...prev, template }))
              }
            />

            <button
              onClick={() => setShowTypographySettings(!showTypographySettings)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <EditIcon className="size-4" />
              Edit
            </button>
          </div> */}

          {/* Navigation */}
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
                activeSectionIndex === sections.length - 1 && "opacity-50"
              }`}
              disabled={activeSectionIndex === sections.length - 1}
            >
              Next <ChevronRight className="size-4" />
            </button>

          </div>
        </div>

        {/* Typography Settings */}
        {showTypographySettings && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">

            <div className="flex flex-row gap-4">

              <TypographySettings
                sectionTypographies={sectionTypographies}
                selectedSection={selectedTypographySection}
                onUpdateTypography={updateTypography}
                onSelectSection={setSelectedTypographySection}
              />

              <ColorPicker
                selectedColor={resumeData.accent_color}
                onChange={(color) =>
                  setResumeData(prev => ({
                    ...prev,
                    accent_color: color
                  }))
                }
              />

            </div>
          </div>
        )}

        {/* FORM SECTIONS */}

        <>

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
          onChange={(value) =>
            setResumeData(prev => ({
                ...prev,
                professional_summary: value
              }))
            }
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

        </>
        {/* SAVE BUTTON */}
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
  )
}

export default LeftPanel