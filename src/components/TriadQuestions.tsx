import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TriadQuestion } from "@/types/quiz";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface TriadQuestionsProps {
  questions: TriadQuestion[];
  topThreeTypes: string[];
  onComplete: (scores: { [key: string]: number }) => void;
  totalQuestions: number;
  questionsCompleted: number;
}

const TriadQuestions = ({ 
  questions, 
  topThreeTypes, 
  onComplete,
  totalQuestions,
  questionsCompleted
}: TriadQuestionsProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);

  const progress = ((questionsCompleted + currentQuestion + 1) / totalQuestions) * 100;
  const questionNumber = questionsCompleted + currentQuestion + 1;

  const getCurrentQuestionStatements = () => {
    const question = questions[currentQuestion];
    if (!question?.statements) return [];
    return question.statements.filter(statement => 
      statement.type && topThreeTypes.includes(statement.type)
    );
  };

  const handleSelection = (type: string) => {
    if (selectedOrder.includes(type)) {
      const index = selectedOrder.indexOf(type);
      setSelectedOrder(selectedOrder.slice(0, index));
    } else {
      if (selectedOrder.length < 3) {
        setSelectedOrder([...selectedOrder, type]);
      }
    }
  };

  const handleNext = () => {
    if (selectedOrder.length === 3) {
      const newScores = { ...scores };
      selectedOrder.forEach((type, index) => {
        const points = 2 - index;
        newScores[type] = (newScores[type] || 0) + points;
      });
      setScores(newScores);

      if (currentQuestion < 2) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOrder([]);
      } else {
        onComplete(newScores);
      }
    }
  };

  const currentStatements = getCurrentQuestionStatements();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
      <div className="w-[640px] max-w-full">
        <Card className="bg-white rounded-3xl shadow-sm p-8">
          <h2 className="text-xl text-center mb-8">
            Answer with your whole life in view, for how you are most of the time.
          </h2>

          <div className="mb-4 flex justify-between items-center text-sm text-gray-500">
            <span>Question {questionNumber} of {totalQuestions}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>

          <Progress value={progress} className="mb-8" />

          <div className="text-center mb-8 text-xl font-medium">
            Select in order of what you most agree with
          </div>

          <div className="space-y-4">
            {currentStatements.map((statement, index) => {
              const selectionIndex = selectedOrder.indexOf(statement.type);
              const isSelected = selectionIndex !== -1;

              return (
                <button
                  key={index}
                  onClick={() => handleSelection(statement.type)}
                  className={`w-full p-4 rounded-xl text-left transition-all border
                    ${isSelected 
                      ? 'bg-purple-600 text-white border-transparent' 
                      : 'bg-white border-gray-200 hover:border-purple-200'}
                    relative group flex items-center justify-between`}
                >
                  <span>{statement.text}</span>
                  {isSelected && (
                    <span className="ml-4 bg-white/20 px-3 py-1 rounded-full text-sm">
                      #{selectionIndex + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-600"
              disabled={true}
            >
              <ArrowLeft size={16} />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedOrder.length !== 3}
              className={`flex items-center gap-2 px-8 py-2 rounded-full
                ${selectedOrder.length === 3 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90' 
                  : 'bg-gray-100 text-gray-400'}
                transition-all`}
            >
              Next
              <ArrowRight size={16} />
            </Button>
          </div>

          {selectedOrder.length < 3 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Select all 3 options in order of preference to continue
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TriadQuestions; 