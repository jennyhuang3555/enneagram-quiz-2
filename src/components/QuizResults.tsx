import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Quiz } from "@/types/quiz";
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
  // Transform scores into chart data format
  const chartData = [
    {
      subject: "Type 1",
      score: scores.type1 || 0,
      fullMark: 25,
    },
    {
      subject: "Type 2",
      score: scores.type2 || 0,
      fullMark: 25,
    },
    {
      subject: "Type 3",
      score: scores.type3 || 0,
      fullMark: 25,
    },
    {
      subject: "Type 4",
      score: scores.type4 || 0,
      fullMark: 25,
    },
    {
      subject: "Type 5",
      score: scores.type5 || 0,
      fullMark: 25,
    },
    {
      subject: "Type 6",
      score: scores.type6 || 0,
      fullMark: 25,
    },
    {
      subject: "Type 7",
      score: scores.type7 || 0,
      fullMark: 25,
    },
    {
      subject: "Type 8",
      score: scores.type8 || 0,
      fullMark: 25,
    },
    {
      subject: "Type 9",
      score: scores.type9 || 0,
      fullMark: 25,
    },
  ];

  // Find dominant type with proper type handling
  const dominantType = Object.entries(scores).reduce<string>((a, [key, value]) => 
    scores[a] > value ? a : key, Object.keys(scores)[0]
  );

  return (
    <Card className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in bg-white/95 backdrop-blur">
      <h2 className="text-3xl font-bold text-center">Your Enneagram Results</h2>
      <p className="text-xl text-center text-muted-foreground">
        Your dominant type is: <span className="font-bold text-primary">{dominantType.replace('type', 'Type ')}</span>
      </p>
      
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 25]} />
            <Radar
              name="Score"
              dataKey="score"
              stroke={COLORS[dominantType as keyof typeof COLORS]}
              fill={COLORS[dominantType as keyof typeof COLORS]}
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
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
                    <div key={range.id}>
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