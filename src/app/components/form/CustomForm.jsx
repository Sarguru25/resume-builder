import React from 'react'
import { Plus, Trash2 } from 'lucide-react'

const CustomSectionForm = ({ data, onChange }) => {

  const addSection = () => {
    onChange([...(data || []), { sectionTitle: "", items: [{ title: "", description: "" }] }])
  }

  const addItem = (sectionIndex) => {
    const updated = [...(data || [])]
    updated[sectionIndex].items.push({ title: "", description: "" })
    onChange(updated)
  }

  const updateItem = (sectionIndex, itemIndex, field, value) => {
    const updated = [...(data || [])]
    updated[sectionIndex].items[itemIndex][field] = value
    onChange(updated)
  }

  const updateSectionTitle = (index, value) => {
    const updated = [...(data || [])]
    updated[index].sectionTitle = value
    onChange(updated)
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>Custom Sections</h3>
          <p className='text-sm text-gray-500'>Add any custom sections like Certifications or Awards.</p>
        </div>
        <button onClick={addSection} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors'>
          <Plus className='size-4' /> Add Section
        </button>
      </div>

      <div className='space-y-4 mt-6'>
        {(data || []).map((section, i) => (
          <div key={i} className='p-4 border border-gray-200 rounded-lg space-y-3'>
            <input
              value={section.sectionTitle}
              onChange={(e) => updateSectionTitle(i, e.target.value)}
              placeholder='Section Title (eg: Certifications)'
              className='px-3 py-2 text-sm border border-gray-300 rounded-lg w-full'
            />

            {section.items.map((item, j) => (
              <div key={j} className='grid gap-2'>
                <input
                  value={item.title}
                  onChange={(e) => updateItem(i, j, "title", e.target.value)}
                  placeholder='Title'
                  className='px-3 py-2 text-sm border border-gray-300 rounded-lg w-full'
                />
                <textarea
                  value={item.description}
                  onChange={(e) => updateItem(i, j, "description", e.target.value)}
                  placeholder='Description'
                  rows={3}
                  className='px-3 py-2 text-sm border border-gray-300 rounded-lg w-full resize-none'
                />
              </div>
            ))}

            <button onClick={() => addItem(i)} className='text-sm text-purple-600 hover:text-purple-700 transition-colors'>
              + Add Item
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomSectionForm
