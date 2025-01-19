import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Quiz } from "@/types/quiz";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface QuizResultsProps {
  quiz: Quiz;
  scores: { [key: string]: number };
  onClose: () => void;
}

const QuizResults = ({ quiz, scores, onClose }: QuizResultsProps) => {
  const chartData = Object.entries(scores).map(([type, score]) => ({
    type,
    score,
  }));

  const config = {
    score: {
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))",
      },
    },
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Your Enneagram Results</h2>
      
      <div className="h-[400px] w-full">
        <ChartContainer config={config}>
          <RadarChart data={chartData} outerRadius={150}>
            <PolarGrid />
            <PolarAngleAxis dataKey="type" />
            <PolarRadiusAxis />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload) return null;
                return (
                  <ChartTooltipContent
                    payload={payload}
                    nameKey="type"
                    labelKey="score"
                  />
                );
              }}
            />
            <Radar
              name="Score"
              dataKey="score"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
              stroke="hsl(var(--primary))"
            />
          </RadarChart>
        </ChartContainer>
      </div>

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
          Close Results
        </Button>
      </div>
    </Card>
  );
};

export default QuizResults;