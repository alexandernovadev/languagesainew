import React from 'react';
import { Check } from 'lucide-react';
import { QuestionOption } from './types';

interface MultipleChoiceOptionProps {
  option: QuestionOption;
  isSelected: boolean;
  isAnswered: boolean;
  onSelect: () => void;
}

export const MultipleChoiceOption = React.memo(({
  option,
  isSelected,
  isAnswered,
  onSelect
}: MultipleChoiceOptionProps) => {
  const optionLetter = option.value.toUpperCase();
  
  return (
    <div
      onClick={onSelect}
      className={`
        relative cursor-pointer
        p-3 rounded-xl border-2
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
        absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center
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

      {/* Option content - compact layout */}
      <div className="flex items-start gap-3 pr-8">
        {/* Option letter */}
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0
          transition-colors duration-200 ease-out
          ${isSelected 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-600 text-gray-300'
          }
          ${isAnswered && isSelected 
            ? 'bg-emerald-500 text-white' 
            : ''
          }
        `}>
          {optionLetter}
        </div>

        {/* Option text */}
        <p className={`
          text-sm leading-relaxed transition-colors duration-200 ease-out flex-1
          ${isSelected 
            ? 'text-gray-100 font-medium' 
            : 'text-gray-300'
          }
        `}>
          {option.label}
        </p>
      </div>
    </div>
  );
}); 