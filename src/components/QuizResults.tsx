import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Quiz } from "@/types/quiz";

interface QuizResultsProps {
  quiz: Quiz;
  score: number;
  onClose: () => void;
}

const QuizResults = ({ quiz, score, onClose }: QuizResultsProps) => {
  const result = quiz.resultRanges.find(
    (range) => score >= range.minScore && score <= range.maxScore
  );

  return (
    <Card className="p-6 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Quiz Results</h2>
      <div className="space-y-4">
        <p className="text-xl">Your score: {score} points</p>
        {result ? (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{result.title}</h3>
            <p className="text-muted-foreground">{result.description}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">No result range matches your score.</p>
        )}
        <Button onClick={onClose} className="w-full">
          Close Preview
        </Button>
      </div>
    </Card>
  );
};

export default QuizResults;