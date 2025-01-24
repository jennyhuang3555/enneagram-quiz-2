import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Quiz } from "@/types/quiz";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { typeDescriptions } from '@/data/typeDescriptions';

interface QuizResultsProps {
  quiz: Quiz;
  scores: { [key: string]: number };
  onClose: () => void;
}

const TYPE_COLORS = {
  type1: "#FF9F43", // Orange
  type2: "#FF6B6B", // Coral
  type3: "#FF75D8", // Pink
  type4: "#A06CD5", // Purple
  type5: "#7367F0", // Indigo
  type6: "#00CFE8", // Cyan
  type7: "#28C76F", // Green
  type8: "#9FE6A0", // Light Green
  type9: "#FFE66D", // Yellow
};

const TYPE_NAMES = {
  type1: "The Reformer",
  type2: "The Helper",
  type3: "The Achiever",
  type4: "The Individualist",
  type5: "The Investigator",
  type6: "The Loyalist",
  type7: "The Enthusiast",
  type8: "The Challenger",
  type9: "The Peacemaker",
};

interface TypeDescription {
  title: string;
  inNutshell: string;
  motivationAndFears: string;
  worldview: string;
  blindSpots: string[];  // Array for bullet points
  strengths: string[];   // Array for bullet points
  triggers: string[];    // Array for bullet points
  challengingPatterns: string[];
  growthQuestions: string[];  // Array for bullet points
  growthDescription: string;
}

const QuizResults = ({ quiz, scores, onClose }: QuizResultsProps) => {
  // Add console logs to debug
  console.log('Scores:', scores);
  
  const dominantType = Object.entries(scores)
    .reduce((a, [key, value]) => {
      return scores[a] > value ? a : key;
    }, Object.keys(scores)[0]);
  
  console.log('Dominant Type:', dominantType);
  
  const dominantTypeDesc = typeDescriptions[dominantType as keyof typeof typeDescriptions];
  console.log('Type Description:', dominantTypeDesc);

  // Add a guard clause
  if (!dominantTypeDesc) {
    console.error('No type description found for:', dominantType);
    return (
      <div className="p-6">
        <h3>Error loading results</h3>
        <p>Could not find type description for {dominantType}</p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  // Ensure all types are included in chart data
  const chartData = Object.entries(TYPE_COLORS)
    .map(([type, color]) => ({
      name: `Type ${type.replace('type', '')}`,
      value: scores[type] || 0,
      normalizedValue: scores[type] || 0, // Will be adjusted after sorting
      color: color
    }))
    .sort((a, b) => b.value - a.value);

  // Calculate normalized values after sorting
  const maxScore = Math.max(...chartData.map(item => item.value));
  const minScore = Math.min(...chartData.map(item => item.value));
  const range = maxScore - minScore || 1; // Prevent division by zero

  // Update normalized values
  chartData.forEach(item => {
    item.normalizedValue = 5 + ((item.value - minScore) / range * 95);
  });

  // Ensure dominantType is in correct format (type1, type2, etc.)
  const dominantTypeFormatted = dominantType.startsWith('type') ? dominantType : `type${dominantType}`;

  return (
    <Card className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in bg-white/95 backdrop-blur">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-center mb-8">
          {dominantTypeDesc.title}
        </h2>
        <p className="text-xl text-muted-foreground">
          Your dominant type is:{" "}
          <span 
            className="font-bold"
            style={{ color: TYPE_COLORS[dominantTypeFormatted as keyof typeof TYPE_COLORS] }}
          >
            Type {dominantType.replace('type', '')} - {TYPE_NAMES[dominantTypeFormatted as keyof typeof TYPE_NAMES]}
          </span>
        </p>
      </div>
      
      <div className="h-[600px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              fontSize={12}
              stroke="#64748b"
            />
            <YAxis 
              type="category" 
              dataKey="name"
              fontSize={14}
              stroke="#64748b"
              width={80}
            />
            <Tooltip 
              formatter={(value: number) => `${Math.round(value)}%`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Bar 
              dataKey="normalizedValue" 
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-6 mt-8">
        <h3 className="text-2xl font-bold" style={{ color: TYPE_COLORS[dominantTypeFormatted as keyof typeof TYPE_COLORS] }}>
          Type {dominantType.replace('type', '')} - {dominantTypeDesc.title}
        </h3>
        
        <div className="prose max-w-none space-y-6">
          <section>
            <h4 className="text-2xl font-semibold mb-4">In a Nutshell</h4>
            <p className="text-xl">{dominantTypeDesc.inNutshell}</p>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4">Motivation and Core Fears</h4>
            <p className="text-xl">{dominantTypeDesc.motivationAndFears}</p>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4">Worldview and Focus of Attention</h4>
            <p className="text-xl">{dominantTypeDesc.worldview}</p>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4">Blind Spots</h4>
            <ul className="list-disc pl-5 space-y-3">
              {dominantTypeDesc.blindSpots.map((item, index) => (
                <li key={index} className="text-xl">{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4">Strengths and Gifts</h4>
            <ul className="list-disc pl-5 space-y-3">
              {dominantTypeDesc.strengths.map((item, index) => (
                <li key={index} className="text-xl">{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4">Triggers</h4>
            <ul className="list-disc pl-5 space-y-3">
              {dominantTypeDesc.triggers.map((item, index) => (
                <li key={index} className="text-xl">{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4">Challenging Patterns</h4>
            <ul className="list-disc pl-5 space-y-3">
              {dominantTypeDesc.challengingPatterns.map((item, index) => (
                <li key={index} className="text-xl">{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4">Growth Questions</h4>
            <p className="text-xl mb-4">{dominantTypeDesc.growthDescription}</p>
            <ul className="list-disc pl-5 space-y-3">
              {dominantTypeDesc.growthQuestions.slice(2).map((item, index) => (
                <li key={index} className="text-xl">{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(scores)
          .sort(([, a], [, b]) => b - a)
          .map(([type, score]) => (
            <div
              key={type}
              className={`p-4 rounded-lg border-2 ${
                type === dominantType ? `ring-2 ring-offset-2 ring-[${TYPE_COLORS[type as keyof typeof TYPE_COLORS]}]` : ''
              }`}
              style={{ 
                borderColor: TYPE_COLORS[type as keyof typeof TYPE_COLORS],
                backgroundColor: `${TYPE_COLORS[type as keyof typeof TYPE_COLORS]}10`
              }}
            >
              <h3 className="text-lg font-semibold" style={{ color: TYPE_COLORS[type as keyof typeof TYPE_COLORS] }}>
                Type {type.replace('type', '')}
                {type === dominantType && ' ★'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {TYPE_NAMES[type as keyof typeof TYPE_NAMES]}
              </p>
              <p className="text-2xl font-bold mt-2" style={{ color: TYPE_COLORS[type as keyof typeof TYPE_COLORS] }}>
                {score}
              </p>
            </div>
          ))}
      </div>

      <Button 
        onClick={onClose} 
        className="w-full mt-6"
        style={{
          background: TYPE_COLORS[dominantTypeFormatted as keyof typeof TYPE_COLORS],
          color: 'white'
        }}
      >
        Take Quiz Again
      </Button>
    </Card>
  );
};

export default QuizResults;