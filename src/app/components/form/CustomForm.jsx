import React from 'react'
import { Plus, Trash2 } from 'lucide-react'

const CustomSectionForm = ({ data, onChange }) => {

  const addSection = () => {
    onChange([...(data || []), { sectionTitle: "", items: [{ title: "", description: "" }] }])
  }

  const removeSection = (sectionIndex) => {
    onChange((data || []).filter((_, i) => i !== sectionIndex))
  }

  const addItem = (sectionIndex) => {
    const updated = [...(data || [])]
    updated[sectionIndex].items.push({ title: "", description: "" })
    onChange(updated)
  }

  const removeItem = (sectionIndex, itemIndex) => {
    const updated = [...(data || [])]
    updated[sectionIndex].items = updated[sectionIndex].items.filter((_, i) => i !== itemIndex)
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
          <p className='text-sm text-gray-500'>
            Add any custom sections like Certifications or Awards.
          </p>
        </div>
        <button
          onClick={addSection}
          className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors'
        >
          <Plus className='size-4' /> Add Section
        </button>
      </div>

      <div className='space-y-4 mt-6'>
        {(data || []).length === 0 && (
          <p className='text-gray-500 text-sm text-center py-6'>
            No custom sections added yet.
          </p>
        )}

        {(data || []).map((section, i) => (
          <div
            key={i}
            className='p-4 border border-gray-200 rounded-lg space-y-4'
          >
            {/* Section Header */}
            <div className='flex items-start justify-between'>
              <h4 className='text-lg font-semibold text-gray-900'>
                Section #{i + 1}
              </h4>
              <button
                onClick={() => removeSection(i)}
                className='text-red-500 hover:text-red-700 transition-colors'
              >
                <Trash2 className='size-4' />
              </button>
            </div>

            {/* Section Title */}
            <input
              value={section.sectionTitle}
              onChange={(e) => updateSectionTitle(i, e.target.value)}
              placeholder='Section Title (eg: Certifications)'
              className='px-3 py-2 text-sm border border-gray-300 rounded-lg w-full'
            />

            {/* Items */}
            {section.items.map((item, j) => (
              <div
                key={j}
                className='p-3 border border-gray-100 rounded-lg space-y-2'
              >
                <div className='flex items-start justify-between'>
                  <h5 className='text-sm font-medium text-gray-700'>
                    Item #{j + 1}
                  </h5>
                  <button
                    onClick={() => removeItem(i, j)}
                    className='text-red-500 hover:text-red-700 transition-colors'
                  >
                    <Trash2 className='size-4' />
                  </button>
                </div>

                <input
                  value={item.title}
                  onChange={(e) =>
                    updateItem(i, j, "title", e.target.value)
                  }
                  placeholder='Title'
                  className='px-3 py-2 text-sm border border-gray-300 rounded-lg w-full'
                />

                <textarea
                  value={item.description}
                  onChange={(e) =>
                    updateItem(i, j, "description", e.target.value)
                  }
                  placeholder='Description'
                  rows={3}
                  className='px-3 py-2 text-sm border border-gray-300 rounded-lg w-full resize-none'
                />
              </div>
            ))}

            {/* Add Item Button */}
            <button
              onClick={() => addItem(i)}
              className='flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 transition-colors'
            >
              <Plus className='size-4' /> Add Item
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomSectionForm
