import React from 'react';
import { Check, Palette, Plus, X } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

const ColorPicker = ({ selectedColor, onChange }) => {
const colors = [
  { name: 'blue', value: '#3b82f6' },
  { name: 'red', value: '#ef4444' },
  { name: 'green', value: '#10b981' },
  // { name: 'purple', value: '#8b5cf6' },
  { name: 'pink', value: '#ec4899' },
  { name: 'indigo', value: '#6366f1' },
  { name: 'yellow', value: '#f59e0b' },
  { name: 'teal', value: '#14b8a6' },
  { name: 'rose', value: '#f43f5e' },
  { name: 'violet', value: '#8b5cf6' },
  { name: 'emerald', value: '#10b981' },
  { name: 'amber', value: '#f59e0b' },
  { name: 'black', value: '#000000' }
];

  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customColor, setCustomColor] = useState(selectedColor);
  const customColorRef = useRef(null);

  // Close the color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCustomPicker && !event.target.closest('.color-picker-container')) {
        setShowCustomPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomPicker]);

  // Update custom color when selected color changes
  useEffect(() => {
    setCustomColor(selectedColor);
  }, [selectedColor]);

  return (
    <div className='relative color-picker-container'>
      <button onClick={()=>setIsOpen(!isOpen)} className='flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-100 hover:ring transition-all px-3 py-2 rounded-lg'>
        <Palette size={16} /> <span className='max-sm:hidden'>Accent</span>
      </button>
      {isOpen && (
        <div className='grid grid-cols-4 w-60 gap-2 absolute top-full left-0 ring-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
          {colors.map((color) => (
            <div key={color.value} className='relative group flex flex-col items-center'>
              <button
                onClick={() => {
                  onChange(color.value);
                  setIsOpen(false);
                }}
                className='w-12 h-12 rounded-full border-2 border-transparent hover:border-black/25 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
                style={{ backgroundColor: color.value }}
                aria-label={`Select ${color.name} color`}
                aria-pressed={selectedColor === color.value}
              >
                {selectedColor === color.value && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <Check className='size-5 text-white' />
                  </div>
                )}
              </button>
              <p className='text-xs text-center mt-1 text-gray-600'>{color.name}</p>
            </div>
           ))}
           
           {/* Custom Color Picker */}
           <div className='relative group flex flex-col items-center'>
             <div className='relative'>
               <button
                 onClick={() => {
                   setShowCustomPicker(!showCustomPicker);
                   if (!showCustomPicker) {
                     setTimeout(() => customColorRef.current?.click(), 0);
                   }
                 }}
                 className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                   selectedColor && !colors.some(c => c.value === selectedColor)
                     ? 'ring-2 ring-offset-1 ring-purple-500'
                     : 'border-2 border-dashed border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                 }`}
                 style={{
                   backgroundColor: selectedColor && !colors.some(c => c.value === selectedColor) 
                     ? selectedColor 
                     : 'transparent'
                 }}
                 aria-label='Add custom color'
               >
                 {!selectedColor || colors.some(c => c.value === selectedColor) ? (
                   <Plus className='text-gray-400 group-hover:text-purple-500 transition-colors' size={20} />
                 ) : (
                   <div className='w-full h-full rounded-full flex items-center justify-center'>
                     <Check className='text-white' size={20} />
                   </div>
                 )}
               </button>
               <p className='text-xs text-center mt-1 text-gray-600'>
                 {selectedColor && !colors.some(c => c.value === selectedColor) ? 'Custom' : 'Custom'}
               </p>
             </div>
             
             {showCustomPicker && (
               <div className='absolute top-14 left-1/2 -translate-x-1/2 z-20 bg-white p-4 rounded-lg shadow-xl border border-gray-100 animate-fadeIn'>
                 <div className='flex items-center gap-3 mb-3'>
                   <div 
                     className='w-10 h-10 rounded-md border border-gray-200 shadow-sm flex-shrink-0'
                     style={{ backgroundColor: customColor }}
                   />
                   <div className='flex-1'>
                     <p className='text-sm font-medium text-gray-800'>Custom Color</p>
                     <p className='text-xs text-gray-500 font-mono'>{customColor.toUpperCase()}</p>
                   </div>
                 </div>
                 <input
                   type='color'
                   ref={customColorRef}
                   value={customColor}
                   onChange={(e) => setCustomColor(e.target.value)}
                   className='w-full h-10 cursor-pointer block mb-3 rounded-lg border border-gray-200 overflow-hidden'
                 />
                 <div className='flex gap-2'>
                   <button 
                     onClick={() => setShowCustomPicker(false)}
                     className='flex-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors'
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={() => {
                       if (customColor) {
                         onChange(customColor);
                         setIsOpen(false);
                       }
                       setShowCustomPicker(false);
                     }}
                     className='flex-1 text-sm text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-md transition-colors shadow-sm'
                   >
                     Apply
                   </button>
                 </div>
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;