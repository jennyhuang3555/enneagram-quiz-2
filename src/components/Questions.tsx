import { useState } from "react";
import QuizQuestion from "./QuizQuestion";
import quizData from '@/data/quiz-questions.json';

interface QuestionsProps {
  onComplete: (scores: { [key: string]: number }) => void;
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

const Questions = ({ onComplete, onBack }: QuestionsProps) => {
  // Use questions from our JSON file instead of localStorage
  const questions = quizData.questions;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>(INITIAL_SCORES);

  const handleNext = (score: number) => {
    const currentType = `type${questions[currentQuestion].category}`;
    const newScores = { 
      ...scores,
      [currentType]: (scores[currentType] || 0) + score
    };
    setScores(newScores);

    if (currentQuestion === questions.length - 1) {
      onComplete(newScores);
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