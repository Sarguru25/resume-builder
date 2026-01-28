'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Type, X, RotateCcw } from 'lucide-react'

const SECTIONS = [
  { id: 'header', label: 'Header' },
  { id: 'professional_summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'participations', label: 'Participations' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'languages', label: 'Languages' },
]

const DEFAULTS = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  lineHeight: 1.5,
}

const TypographySettings = ({
  sectionTypographies,
  selectedSection,
  onUpdateTypography,
  onSelectSection,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  // Click outside to close
useEffect(() => {
  const handler = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setIsOpen(false)
      onClose?.()
    }
  }

  document.addEventListener('mousedown', handler)
  return () => document.removeEventListener('mousedown', handler)
}, [onClose])


  const values = sectionTypographies[selectedSection] || DEFAULTS

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium
        bg-gradient-to-br from-blue-50 to-blue-100
        text-blue-700 ring-1 ring-blue-300/60
        hover:ring-blue-400 transition px-3 py-2 rounded-lg"
      >
        <Type size={14} />
        <span className="max-sm:hidden">Typography</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 w-80 z-50
          bg-white border border-gray-200 rounded-xl shadow-lg
          animate-in fade-in zoom-in-95"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-sm font-semibold text-gray-800">
              Typography Settings
            </h3>
            <button
              onClick={() => {
                setIsOpen(false)
                onClose?.()
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Section Pills */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">
                Section
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectSection(s.id)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition
                      ${
                        selectedSection === s.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-600">
                Font Family
              </label>
              <select
                value={values.fontFamily}
                onChange={(e) =>
                  onUpdateTypography('fontFamily', e.target.value)
                }
                className="w-full rounded-md border px-2 py-2 text-xs
                focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Times New Roman', serif">
                  Times New Roman
                </option>
                <option value="'Georgia', serif">Georgia</option>
                <option value="'Poppins', sans-serif">Poppins</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
              </select>
            </div>

            {/* Font Size */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold text-gray-600">
                  Font Size
                </span>
                <span className="text-xs text-gray-500">
                  {values.fontSize}px
                </span>
              </div>
              <input
                type="range"
                min="11"
                max="18"
                value={values.fontSize}
                onChange={(e) =>
                  onUpdateTypography('fontSize', Number(e.target.value))
                }
                className="w-full accent-blue-500"
              />
            </div>

            {/* Line Height */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold text-gray-600">
                  Line Height
                </span>
                <span className="text-xs text-gray-500">
                  {values.lineHeight}
                </span>
              </div>
              <input
                type="range"
                min="1.2"
                max="2"
                step="0.1"
                value={values.lineHeight}
                onChange={(e) =>
                  onUpdateTypography(
                    'lineHeight',
                    Number(e.target.value)
                  )
                }
                className="w-full accent-blue-500"
              />
            </div>

            {/* Preview */}
            <div
              className="border rounded-md p-3 text-sm text-gray-700 bg-gray-50"
              style={{
                fontFamily: values.fontFamily,
                fontSize: values.fontSize,
                lineHeight: values.lineHeight,
              }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>

            {/* Reset */}
            <button
              onClick={() =>
                Object.entries(DEFAULTS).forEach(([k, v]) =>
                  onUpdateTypography(k, v)
                )
              }
              className="flex items-center gap-1 text-xs text-gray-500
              hover:text-gray-700 transition"
            >
              <RotateCcw size={12} />
              Reset section typography
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TypographySettings
