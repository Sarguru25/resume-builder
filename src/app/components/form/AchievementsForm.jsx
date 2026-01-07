import React from 'react'
import { Plus, Trash2 } from 'lucide-react'

const AchievementsForm = ({ data, onChange }) => {

  const addAchievement = () => {
    onChange([...(data || []), { title: "", year: "", description: "" }])
  }

  const updateAchievement = (index, field, value) => {
    const updated = [...(data || [])]
    updated[index][field] = value
    onChange(updated)
  }

  const removeAchievement = (index) => {
    onChange((data || []).filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>Achievements</h3>
          <p className='text-sm text-gray-500'>Add your awards and recognitions.</p>
        </div>
        <button onClick={addAchievement} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors'>
          <Plus className='size-4' /> Add Achievement
        </button>
      </div>

      <div className='space-y-4 mt-6'>
        {(data || []).length === 0 && (
          <p className='text-gray-500 text-sm text-center py-6'>No achievements added yet.</p>
        )}

        {(data || []).map((item, index) => (
          <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
            <div className='flex items-start justify-between'>
              <h4 className='text-lg font-semibold text-gray-900'>Achievement #{index + 1}</h4>
              <button onClick={() => removeAchievement(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                <Trash2 className='size-4' />
              </button>
            </div>

            <div className='grid gap-3'>
              <input
                value={item.title}
                onChange={(e) => updateAchievement(index, "title", e.target.value)}
                placeholder='Title'
                className='px-3 py-2 text-sm border border-gray-300 rounded-lg w-full'
              />
              <input
                value={item.year}
                onChange={(e) => updateAchievement(index, "year", e.target.value)}
                placeholder='Year'
                className='px-3 py-2 text-sm border border-gray-300 rounded-lg w-full'
              />
              <textarea
                value={item.description}
                onChange={(e) => updateAchievement(index, "description", e.target.value)}
                placeholder='Description'
                rows={3}
                className='px-3 py-2 text-sm border border-gray-300 rounded-lg w-full resize-none'
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AchievementsForm
