import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'

const LanguageForm = ({ data, onChange }) => {
  const [newLanguage, setNewLanguage] = useState({ language: "", proficiency: "" })

  const addLanguage = () => {
    if (newLanguage.language.trim()) {
      onChange([...(data || []), newLanguage])
      setNewLanguage({ language: "", proficiency: "" })
    }
  }

  const removeLanguage = (index) => {
    onChange((data || []).filter((_, i) => i !== index))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addLanguage()
    }
  }

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Languages</h3>
        <p className='text-sm text-gray-500'>Add languages you know.</p>
      </div>

      <div className='flex gap-2'>
        <input
          type="text"
          placeholder='Language'
          value={newLanguage.language}
          onChange={(e) => setNewLanguage({ ...newLanguage, language: e.target.value })}
          onKeyDown={handleKeyPress}
          className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <select
          value={newLanguage.proficiency}
          onChange={(e) => setNewLanguage({ ...newLanguage, proficiency: e.target.value })}
          className='px-3 py-2 text-sm border border-gray-300 rounded-lg'
        >
          <option value="">Level</option>
          <option>Basic</option>
          <option>Intermediate</option>
          <option>Fluent</option>
          <option>Native</option>
        </select>
        <button
          onClick={addLanguage}
          disabled={!newLanguage.language.trim()}
          className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Plus className='size-4'/>
        </button>
      </div>

      {(data || []).length > 0 ? (
        <div className='flex flex-wrap gap-2 mt-2'>
          {data.map((lang, index) => (
            <span key={index} className='flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
              {lang.language} ({lang.proficiency || "Level"})
              <button onClick={() => removeLanguage(index)} className='ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors'>
                <X className='w-3 h-3' />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className='text-gray-500 text-sm text-center py-6'>No languages added yet.</p>
      )}
    </div>
  )
}

export default LanguageForm
