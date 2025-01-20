import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Quiz, Question } from "@/types/quiz";
import QuizResults from "./QuizResults";

interface QuizPreviewProps {
  quiz: Quiz;
  onClose: () => void;
}

const QuizPreview = ({ quiz, onClose }: QuizPreviewProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ type: string; points: number }[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion: Question = quiz.questions[currentQuestionIndex];

  const handleAnswer = (points: number) => {
    if (!currentQuestion) return;
    
    const newAnswers = [...answers, { type: currentQuestion.category, points }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    const scoresByType = answers.reduce((acc, answer) => {
      acc[answer.type] = (acc[answer.type] || 0) + answer.points;
      return acc;
    }, {} as { [key: string]: number });

    return <QuizResults quiz={quiz} scores={scoresByType} onClose={onClose} />;
  }

  if (!currentQuestion) {
    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <p>No questions available.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{quiz.title}</h2>
        <p className="text-muted-foreground">{quiz.description}</p>
        
        <div className="w-full bg-secondary h-2 rounded-full">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">{currentQuestion.text}</h3>
          <div className="grid gap-3">
            {currentQuestion.options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="w-full text-left justify-start h-auto p-4 hover:bg-secondary"
                onClick={() => handleAnswer(option.points)}
              >
                {option.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuizPreview;