export interface Question {
  id: string;
  text: string;
  category: string;
  options: {
    id: string;
    text: string;
    points: number;
  }[];
}

export interface ResultRange {
  id: string;
  minScore: number;
  maxScore: number;
  title: string;
  description: string;
  category: string; // Added to associate ranges with specific types
}

export interface Quiz {
  title: string;
  description: string;
  questions: Question[];
  resultRanges: ResultRange[];
}

export interface QuestionResponse {
  questionId: string;
  questionText: string;
  category: number;
  score: number;
  answerText: string;
}