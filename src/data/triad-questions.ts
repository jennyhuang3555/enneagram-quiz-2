import { TriadQuestion } from '@/types/quiz';

// Import the JSON file
const triadQuestionsData = await import('./triad-questions.json');

// Export the questions with proper typing
export const triadQuestions: TriadQuestion[] = triadQuestionsData.default; 