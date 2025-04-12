import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TriadQuestion } from "@/types/quiz";

interface TriadQuestionsProps {
  questions: TriadQuestion[];
  onComplete: (scores: { [key: string]: number }) => void;
}

const TriadQuestions = ({ questions, onComplete }: TriadQuestionsProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSelection = (type: string) => {
    if (!selectedOrder.includes(type)) {
      const newOrder = [...selectedOrder, type];
      setSelectedOrder(newOrder);

      if (newOrder.length === 3) {
        // Calculate scores: 2 points for first, 1 for second, 0 for third
        const newScores = { ...scores };
        newOrder.forEach((type, index) => {
          const points = 2 - index; // 2, 1, 0 points respectively
          newScores[type] = (newScores[type] || 0) + points;
        });
        setScores(newScores);

        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOrder([]);
        } else {
          onComplete(newScores);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-2xl w-full p-8 glass-card space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <h3 className="text-xl font-semibold text-center py-4">
          {questions[currentQuestion].question}
        </h3>

        <div className="grid gap-3">
          {questions[currentQuestion].statements.map((statement, index) => (
            <Button
              key={index}
              variant={selectedOrder.includes(statement.type) ? "default" : "outline"}
              className={`w-full justify-start p-4 text-left ${
                selectedOrder.includes(statement.type)
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-50"
              }`}
              onClick={() => handleSelection(statement.type)}
              disabled={selectedOrder.includes(statement.type)}
            >
              {statement.text}
              {selectedOrder.includes(statement.type) && (
                <span className="ml-2">
                  (#{selectedOrder.indexOf(statement.type) + 1})
                </span>
              )}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TriadQuestions; 