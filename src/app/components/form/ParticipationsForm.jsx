import React from 'react'
import { Plus, Trash2 } from 'lucide-react'

const ParticipationForm = ({ data, onChange }) => {

  const addParticipation = () => {
    onChange([...(data || []), { title: "", organization: "", year: "", description: "" }])
  }

  const updateParticipation = (index, field, value) => {
    const updated = [...(data || [])]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeParticipation = (index) => {
    onChange((data || []).filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Participations</h3>
          <p className='text-sm text-gray-500'>Add events, workshops, or competitions.</p>
        </div>
        <button onClick={addParticipation} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors'>
          <Plus className='size-4' /> Add Participation
        </button>
      </div>

      <div className='space-y-4 mt-6'>
        {(data || []).length === 0 && (
          <p className='text-gray-500 text-sm text-center'>No participations added yet.</p>
        )}

        {(data || []).map((item, index) => (
          <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
            <div className='flex items-start justify-between'>
              <h4 className='text-lg font-semibold text-gray-900'>Participation #{index + 1}</h4>
              <button onClick={() => removeParticipation(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                <Trash2 className='size-4' />
              </button>
            </div>

            <div className='grid gap-3'>
              <input value={item.title} onChange={(e) => updateParticipation(index, "title", e.target.value)} placeholder='Title' className='px-3 py-2 text-sm rounded-lg border border-gray-300' />
              <input value={item.organization} onChange={(e) => updateParticipation(index, "organization", e.target.value)} placeholder='Organization' className='px-3 py-2 text-sm rounded-lg border border-gray-300' />
              <input value={item.year} onChange={(e) => updateParticipation(index, "year", e.target.value)} placeholder='Year' className='px-3 py-2 text-sm rounded-lg border border-gray-300' />
              <textarea rows={3} value={item.description} onChange={(e) => updateParticipation(index, "description", e.target.value)} placeholder='Description' className='w-full px-3 py-2 text-sm rounded-lg border border-gray-300 resize-none' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParticipationForm
