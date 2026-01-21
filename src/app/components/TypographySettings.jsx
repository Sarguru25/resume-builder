'use client'

import React, { useState } from 'react'
import { Type, Check } from 'lucide-react'

const TypographySettings = ({
  sectionTypographies,
  selectedSection,
  onUpdateTypography,
  onSelectSection,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg"
      >
        <Type size={14} />
        <span className="max-sm:hidden">Typography</span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-72 p-3 space-y-3 z-50 bg-white rounded-md border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">Text Settings</h3>
            <button
              onClick={() => {
                setIsOpen(false)
                onClose?.()
              }}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          </div>

          {/* Section Selector */}
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-600">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => onSelectSection(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="header">Header</option>
              <option value="professional_summary">Professional Summary</option>
              <option value="experience">Experience</option>
              <option value="projects">Projects</option>
              <option value="education">Education</option>
              <option value="skills">Skills</option>
              <option value="participations">Participations</option>
              <option value="achievements">Achievements</option>
              <option value="languages">Languages</option>
            </select>
          </div>

          {/* Font Family */}
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-600">
              Font Family
            </label>
            <select
              value={sectionTypographies[selectedSection]?.fontFamily || 'Inter, sans-serif'}
              onChange={(e) => onUpdateTypography('fontFamily', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Inter, sans-serif">Inter</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="'Georgia', serif">Georgia</option>
              <option value="'Poppins', sans-serif">Poppins</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'Open Sans', sans-serif">Open Sans</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
              <span>Font Size</span>
              <span>{sectionTypographies[selectedSection]?.fontSize || 14}px</span>
            </label>
            <input
              type="range"
              min="11"
              max="18"
              value={sectionTypographies[selectedSection]?.fontSize || 14}
              onChange={(e) =>
                onUpdateTypography('fontSize', Number(e.target.value))
              }
              className="w-full accent-blue-500"
            />
          </div>

          {/* Line Height */}
          <div>
            <label className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
              <span>Line Height</span>
              <span>{sectionTypographies[selectedSection]?.lineHeight || 1.5}</span>
            </label>
            <input
              type="range"
              min="1.2"
              max="2"
              step="0.1"
              value={sectionTypographies[selectedSection]?.lineHeight || 1.5}
              onChange={(e) =>
                onUpdateTypography('lineHeight', Number(e.target.value))
              }
              className="w-full accent-blue-500"
            />
          </div>

          {/* Footer */}
          <button
            onClick={() => {
              setIsOpen(false)
              onClose?.()
            }}
            className="w-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition"
          >
            Close Settings
          </button>
        </div>
      )}
    </div>
  )
}

export default TypographySettings
