import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

interface QuizQuestionProps {
  question: string;
  currentQuestion: number;
  totalQuestions: number;
  onNext: (score: number) => void;
  onPrevious: () => void;
}

const ANSWER_OPTIONS = [
  { label: "Strongly Disagree", score: 0 },
  { label: "Disagree", score: 1 },
  { label: "Neutral", score: 2 },
  { label: "Agree", score: 3 },
  { label: "Strongly Agree", score: 4 },
];

const QuizQuestion = ({
  question,
  currentQuestion,
  totalQuestions,
  onNext,
  onPrevious,
}: QuizQuestionProps) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-2xl w-full p-8 glass-card space-y-6">
        <div className="space-y-4">
          <p className="text-center text-gray-600 text-base mb-2">
            Answer with your whole life in view, for how you are most of the time.
          </p>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <h3 className="text-xl font-semibold text-center py-4">{question}</h3>

        <div className="grid gap-3">
          {ANSWER_OPTIONS.map((option) => (
            <Button
              key={option.score}
              variant={selectedScore === option.score ? "default" : "outline"}
              className={`w-full justify-start p-4 text-left ${
                selectedScore === option.score
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-50"
              }`}
              onClick={() => setSelectedScore(option.score)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex-1"
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => {
              if (selectedScore !== null) {
                onNext(selectedScore);
                setSelectedScore(null);
              }
            }}
            disabled={selectedScore === null}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity"
          >
            Next
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizQuestion;