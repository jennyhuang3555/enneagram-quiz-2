import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Quiz } from "@/types/quiz";

interface QuizResultsProps {
  quiz: Quiz;
  scores: { [key: string]: number }; // Changed from single score to scores by type
  onClose: () => void;
}

const QuizResults = ({ quiz, scores, onClose }: QuizResultsProps) => {
  return (
    <Card className="p-6 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Quiz Results</h2>
      <div className="space-y-4">
        {Object.entries(scores).map(([type, score]) => (
          <div key={type} className="border-b pb-4">
            <h3 className="text-xl font-semibold capitalize">{type}</h3>
            <p className="text-lg">Score: {score} points</p>
            {quiz.resultRanges
              .filter(range => range.category === type)
              .map(range => {
                if (score >= range.minScore && score <= range.maxScore) {
                  return (
                    <div key={range.id} className="mt-2">
                      <h4 className="font-medium">{range.title}</h4>
                      <p className="text-muted-foreground">{range.description}</p>
                    </div>
                  );
                }
                return null;
              })}
          </div>
        ))}
        <Button onClick={onClose} className="w-full">
          Close Preview
        </Button>
      </div>
    </Card>
  );
};

export default QuizResults;