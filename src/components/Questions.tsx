import { useState } from "react";
import QuizQuestion from "./QuizQuestion";

// Sample questions - in a real app, these would come from your backend
const QUESTIONS = [
  "I tend to be organized and structured in my approach to life.",
  "I often put others' needs before my own.",
  "I value authenticity and expressing my true feelings.",
  "I frequently seek new experiences and opportunities.",
  "I prefer to observe and analyze before taking action.",
];

interface QuestionsProps {
  onComplete: (scores: number[]) => void;
  onBack: () => void;
}

const Questions = ({ onComplete, onBack }: QuestionsProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  const handleNext = (score: number) => {
    const newScores = [...scores, score];
    setScores(newScores);

    if (currentQuestion === QUESTIONS.length - 1) {
      onComplete(newScores);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) {
      onBack();
    } else {
      setCurrentQuestion(currentQuestion - 1);
      setScores(scores.slice(0, -1));
    }
  };

  return (
    <QuizQuestion
      question={QUESTIONS[currentQuestion]}
      currentQuestion={currentQuestion}
      totalQuestions={QUESTIONS.length}
      onNext={handleNext}
      onPrevious={handlePrevious}
    />
  );
};

export default Questions;