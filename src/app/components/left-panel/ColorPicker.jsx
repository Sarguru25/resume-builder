import React, { useState, useRef, useEffect } from 'react';
import { Check, Plus } from 'lucide-react';

const ColorPicker = ({ selectedColor, onChange }) => {
const colors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },     
  { name: 'Green', value: '#22c55e' }, 
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Emerald', value: '#10b981' },  
  { name: 'Amber', value: '#f59e0b' },   
  { name: 'Black', value: '#000000' },
];

  const [showCustom, setShowCustom] = useState(false);
  const [customColor, setCustomColor] = useState(selectedColor || '#ffffff');
  const ref = useRef(null);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowCustom(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => setCustomColor(selectedColor || '#ffffff'), [selectedColor]);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-full" ref={ref}>
      <p className="font-semibold mb-2 text-gray-700">Accent Color</p>
      <div className="grid grid-cols-6 gap-4">
        {colors.map((color) => (
          <div key={color.value} className="flex flex-col items-center">
            <div
              onClick={() => onChange(color.value)}
              className={`w-10 h-10 rounded-md cursor-pointer transition relative ${
                selectedColor === color.value ? 'ring-2 ring-offset-1 ring-purple-500' : ''
              }`}
              style={{ backgroundColor: color.value }}
            >
              {selectedColor === color.value && (
                <Check className="absolute inset-0 m-auto w-5 h-5 text-white" />
              )}
            </div>
            <span className="text-xs mt-1 text-gray-500">{color.name}</span>
          </div>
        ))}

        {/* Custom Color */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => setShowCustom(!showCustom)}
            className={`w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center cursor-pointer transition ${
              !colors.some(c => c.value === selectedColor) ? 'ring-2 ring-offset-1 ring-purple-500' : ''
            }`}
            style={{
              backgroundColor: !colors.some(c => c.value === selectedColor) ? selectedColor : 'transparent',
            }}
          >
            {!selectedColor || colors.some(c => c.value === selectedColor) ? (
              <Plus className="text-gray-400 w-4 h-4" />
            ) : (
              <Check className="text-white w-5 h-5" />
            )}
          </div>
          <span className="text-xs mt-1 text-gray-500">Custom</span>

          {showCustom && (
            <div className="absolute mt-2 p-3 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-full h-10 rounded-md cursor-pointer"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowCustom(false)}
                  className="flex-1 text-sm text-gray-700 border border-gray-200 rounded-md py-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onChange(customColor);
                    setShowCustom(false);
                  }}
                  className="flex-1 text-sm text-white bg-gray-800 rounded-md py-1"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;