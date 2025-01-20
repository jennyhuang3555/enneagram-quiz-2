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

const COLORS = {
  type1: "#FF6B6B",
  type2: "#4ECDC4",
  type3: "#45B7D1",
  type4: "#96CEB4",
  type5: "#FFEEAD",
  type6: "#D4A5A5",
  type7: "#9B59B6",
  type8: "#3498DB",
  type9: "#2ECC71"
};

const QuizResults = ({ quiz, scores, onClose }: QuizResultsProps) => {
  const chartData = Object.entries(scores).map(([type, score]) => ({
    type,
    score,
  }));

  // Find dominant type
  const dominantType = Object.entries(scores).reduce((a, b) => 
    scores[a] > scores[b[0]] ? a : b[0]
  );

  const config = {
    score: {
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))",
      },
    },
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in bg-white/95 backdrop-blur">
      <h2 className="text-3xl font-bold text-center">Your Enneagram Results</h2>
      <p className="text-xl text-center text-muted-foreground">
        Your dominant type is: <span className="font-bold text-primary">{dominantType.replace('type', 'Type ')}</span>
      </p>
      
      <div className="h-[500px] w-full">
        <ChartContainer config={config}>
          <RadarChart data={chartData} outerRadius={200}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="type" 
              tick={{ fill: '#6b7280', fontSize: 14 }}
              tickFormatter={(value) => value.replace('type', 'Type ')}
            />
            <PolarRadiusAxis stroke="#9ca3af" />
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
            {Object.keys(COLORS).map((type) => (
              <Radar
                key={type}
                name={type.replace('type', 'Type ')}
                dataKey="score"
                stroke={COLORS[type as keyof typeof COLORS]}
                fill={COLORS[type as keyof typeof COLORS]}
                fillOpacity={0.6}
                data={chartData.filter(item => item.type === type)}
              />
            ))}
          </RadarChart>
        </ChartContainer>
      </div>

      <div className="space-y-4 mt-8">
        {Object.entries(scores).map(([type, score]) => (
          <div 
            key={type} 
            className={`border-l-4 p-4 rounded-lg ${type === dominantType ? 'bg-primary/10 border-primary' : 'bg-gray-50 border-gray-200'}`}
            style={{ borderLeftColor: COLORS[type as keyof typeof COLORS] }}
          >
            <h3 className="text-xl font-semibold capitalize">
              {type.replace('type', 'Type ')}
              {type === dominantType && ' (Dominant)'}
            </h3>
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
        <Button 
          onClick={onClose} 
          className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
        >
          Take Quiz Again
        </Button>
      </div>
    </Card>
  );
};

export default QuizResults;