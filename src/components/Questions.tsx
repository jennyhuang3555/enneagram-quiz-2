import { useState } from "react";
import QuizQuestion from "./QuizQuestion";
import quizData from '@/data/quiz-questions.json';
import { QuestionResponse } from "@/types/quiz";

interface QuestionsProps {
  onComplete: (scores: { [key: string]: number }, responses: QuestionResponse[]) => void;
  onBack: () => void;
}

// Initialize all 9 types
const INITIAL_SCORES = {
  type1: 0,
  type2: 0,
  type3: 0,
  type4: 0,
  type5: 0,
  type6: 0,
  type7: 0,
  type8: 0,
  type9: 0
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const Questions = ({ onComplete, onBack }: QuestionsProps) => {
  const [questions] = useState(() => shuffleArray(quizData.questions));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>(INITIAL_SCORES);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);

  // Helper function to convert score to answer text
  const getAnswerText = (score: number): string => {
    switch (score) {
      case 1: return "Strongly Disagree";
      case 2: return "Disagree";
      case 3: return "Neutral";
      case 4: return "Agree";
      case 5: return "Strongly Agree";
      default: return "Not Answered";
    }
  };

  const handleNext = (score: number) => {
    const currentType = `type${questions[currentQuestion].category}`;
    const newScores = { 
      ...scores,
      [currentType]: (scores[currentType] || 0) + score
    };
    
    // Store individual question response
    const response: QuestionResponse = {
      questionId: questions[currentQuestion].id,
      questionText: questions[currentQuestion].text,
      category: questions[currentQuestion].category,
      score: score,
      answerText: getAnswerText(score)
    };
    
    const newResponses = [...responses, response];
    setResponses(newResponses);
    setScores(newScores);

    if (currentQuestion === questions.length - 1) {
      console.log('Completing quiz with:', {
        scores: newScores,
        responses: newResponses
      });
      onComplete(newScores, newResponses);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) {
      onBack();
    } else {
      const prevType = questions[currentQuestion - 1].category;
      const prevScore = scores[prevType] || 0;
      const lastScore = scores[prevType] - (scores[prevType] % 1 || 1);
      
      setScores({
        ...scores,
        [prevType]: lastScore
      });
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <QuizQuestion
      question={questions[currentQuestion].text}
      currentQuestion={currentQuestion}
      totalQuestions={questions.length}
      onNext={handleNext}
      onPrevious={handlePrevious}
    />
  );
};

export default Questions;