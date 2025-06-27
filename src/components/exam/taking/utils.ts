export const hasValidAnswer = (answer: any, questionType: string, options?: any[]) => {
  if (answer === null || answer === undefined || answer === '') {
    return false;
  }

  // For multiple choice and true/false, check if it's a valid option
  if (questionType === 'multiple_choice' || questionType === 'true_false') {
    if (questionType === 'multiple_choice') {
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