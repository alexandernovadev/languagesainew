export const hasValidAnswer = (answer: any, questionType: string, options?: any[]) => {
  if (answer === null || answer === undefined || answer === '') {
    return false;
  }

  // For multiple choice, true/false, and fill_blank with options, check if it's a valid option
  if (questionType === 'multiple_choice' || questionType === 'true_false' || 
      (questionType === 'fill_blank' && options && options.length > 0)) {
    if (questionType === 'multiple_choice' || questionType === 'fill_blank') {
      return options?.some(opt => opt.value === answer);
    }
    return answer === 'true' || answer === 'false';
  }

  // For text-based questions, check if it's not just whitespace
  if (typeof answer === 'string') {
    return answer.trim().length > 0;
  }

  return true;
}; 