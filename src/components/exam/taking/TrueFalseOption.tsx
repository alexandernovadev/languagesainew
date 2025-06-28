import React from 'react';
import { Check } from 'lucide-react';

interface TrueFalseOptionProps {
  value: string;
  label: string;
  isSelected: boolean;
  isAnswered: boolean;
  onSelect: () => void;
}

export const TrueFalseOption = React.memo(({
  value,
  label,
  isSelected,
  isAnswered,
  onSelect
}: TrueFalseOptionProps) => {
  const isTrue = value === 'true';
  
  return (
    <div
      onClick={onSelect}
      className={`
        relative cursor-pointer
        p-4 rounded-xl border-2
        transition-colors duration-200 ease-out
        ${isSelected 
          ? 'border-blue-500 bg-blue-500/10 shadow-blue-500/20 shadow-lg' 
          : 'border-gray-600 bg-gray-800/50'
        }
        ${isAnswered && isSelected 
          ? 'border-emerald-500 bg-emerald-500/10 shadow-emerald-500/20' 
          : ''
        }
      `}
    >
      {/* Selection indicator */}
      <div className={`
        absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center
        transition-colors duration-200 ease-out
        ${isSelected 
          ? 'border-blue-500 bg-blue-500' 
          : 'border-gray-500 bg-gray-700'
        }
        ${isAnswered && isSelected 
          ? 'border-emerald-500 bg-emerald-500' 
          : ''
        }
      `}>
        {isSelected && (
          <Check className="w-3 h-3 text-white transition-opacity duration-200" strokeWidth={3} />
        )}
      </div>

      {/* Content - compact layout */}
      <div className="flex items-center gap-3 pr-8">
        {/* Icon */}
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0
          transition-colors duration-200 ease-out
          ${isSelected 
            ? isTrue ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            : 'bg-gray-600 text-gray-300'
          }
          ${isAnswered && isSelected 
            ? isTrue ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            : ''
          }
        `}>
          {isTrue ? '✓' : '✗'}
        </div>

        {/* Label */}
        <p className={`
          text-base font-semibold transition-colors duration-200 ease-out flex-1
          ${isSelected 
            ? 'text-gray-100' 
            : 'text-gray-300'
          }
        `}>
          {label}
        </p>
      </div>
    </div>
  );
}); 