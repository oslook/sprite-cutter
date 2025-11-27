
import React, { useState, useEffect, useRef } from 'react';

interface PresetInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  presets?: number[];
}

const PresetInput: React.FC<PresetInputProps> = ({ 
  label, 
  value, 
  onChange, 
  min = 1, 
  max = 50,
  presets = [2, 3, 4, 6, 8]
}) => {
  // Local state to handle the input text.
  // This allows the user to have an empty input string (while typing)
  // without the parent forcing it back to a number immediately.
  const [textValue, setTextValue] = useState(value.toString());
  
  // We track the last value we successfully emitted to the parent.
  // This prevents the useEffect from overwriting the user's typing
  // if the parent re-renders with the same value we just sent.
  const lastEmitted = useRef(value);

  useEffect(() => {
    // Only update local text if the prop value has changed externally
    // (e.g., via Reset button or Preset click) AND it's different 
    // from what we last told the parent.
    if (value !== lastEmitted.current) {
      setTextValue(value.toString());
      lastEmitted.current = value;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTextValue(val);

    // If empty, we don't emit a change yet, letting the user type.
    if (val === '') return;

    const parsed = parseInt(val);
    if (!isNaN(parsed)) {
      // Allow the value to go to 0 or even out of bounds temporarily while typing
      // We will clamp on blur.
      lastEmitted.current = parsed;
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    let parsed = parseInt(textValue);
    
    // Validate and clamp on blur
    if (isNaN(parsed) || parsed < min) {
      parsed = min;
    } else if (parsed > max) {
      parsed = max;
    }

    setTextValue(parsed.toString());
    
    if (parsed !== lastEmitted.current) {
      lastEmitted.current = parsed;
      onChange(parsed);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
      </div>
      
      <div className="space-y-2">
        {/* Simplified Input */}
        <div className="relative">
            <input
                type="number"
                min={min}
                max={max}
                value={textValue}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium text-gray-700 text-center"
                placeholder={min.toString()}
            />
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-1.5">
            {presets.map(num => (
                <button
                    key={num}
                    onClick={() => {
                        // Directly update parent logic
                        lastEmitted.current = num;
                        setTextValue(num.toString());
                        onChange(num);
                    }}
                    className={`
                        text-xs px-2.5 py-1.5 rounded-md font-medium transition-all border
                        ${value === num 
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-200 shadow-sm ring-1 ring-indigo-200' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                    `}
                >
                    {num}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PresetInput;
