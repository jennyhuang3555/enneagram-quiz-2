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
}

export interface Quiz {
  title: string;
  description: string;
  questions: Question[];
  resultRanges: ResultRange[];
}