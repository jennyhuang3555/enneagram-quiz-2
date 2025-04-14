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
import { QuestionResponse } from '@/types/quiz';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface QuizResultsProps {
  quiz: Quiz;
  scores: { [key: string]: number };
  responses: QuestionResponse[];
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
  type1: "The Perfectionist",
  type2: "The Helper",
  type3: "The Achiever",
  type4: "The Individualist",
  type5: "The Observer",
  type6: "The Loyalist",
  type7: "The Enthusiast",
  type8: "The Challenger",
  type9: "The Peacemaker",
};

const QuizResults = ({ quiz, scores, responses, onClose }: QuizResultsProps) => {
  // Format type keys to ensure they start with "type"
  const formatTypeKey = (type: string) => {
    return type.startsWith('type') ? type : `type${type}`;
  };

  // Sort and format type keys
  const sortedTypes = Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([type]) => formatTypeKey(type));

  // Get the top three types
  const dominantType = formatTypeKey(sortedTypes[0]);
  const secondType = formatTypeKey(sortedTypes[1]);
  const thirdType = formatTypeKey(sortedTypes[2]);

  // Get descriptions with error checking
  const dominantTypeDesc = typeDescriptions[dominantType];
  const secondTypeDesc = typeDescriptions[secondType];
  const thirdTypeDesc = typeDescriptions[thirdType];

  // Error handling for missing descriptions
  if (!dominantTypeDesc || !secondTypeDesc || !thirdTypeDesc) {
    console.error('Missing type descriptions:', {
      dominant: dominantType,
      second: secondType,
      third: thirdType
    });
    return (
      <Card className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Results</h2>
        <p className="mt-4">Unable to load type descriptions. Please try again.</p>
        <Button onClick={onClose} className="mt-6">
          Close
        </Button>
      </Card>
    );
  }

  // Debug logging
  console.log('Scores:', scores);
  console.log('Sorted Types:', sortedTypes);
  console.log('Top Three:', { dominantType, secondType, thirdType });

  // Chart data can still be sorted by type number for display
  const chartData = Object.entries(TYPE_COLORS)
    .map(([type, color]) => ({
      name: `Type ${type.replace('type', '')}`,
      value: scores[type] || 0,
      normalizedValue: scores[type] || 0,
      color: color,
      isDominant: type === dominantType
    }))
    .sort((a, b) => {
      const typeA = parseInt(a.name.replace('Type ', ''));
      const typeB = parseInt(b.name.replace('Type ', ''));
      return typeA - typeB;
    });

  // Calculate normalized values
  const maxScore = Math.max(...chartData.map(item => item.value));
  const minScore = Math.min(...chartData.map(item => item.value));
  const range = maxScore - minScore || 1; // Prevent division by zero

  // Update normalized values to max out at 90%
  chartData.forEach(item => {
    // Convert to percentage between 0-90
    const normalizedValue = ((item.value - minScore) / range) * 90;
    // Ensure minimum of 5% for visibility
    item.normalizedValue = Math.max(5, normalizedValue);
  });

  // Ensure dominantType is in correct format (type1, type2, etc.)
  const dominantTypeFormatted = dominantType.startsWith('type') ? dominantType : `type${dominantType}`;

  return (
    <Card className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in bg-white/95 backdrop-blur">
      <h1 className="text-3xl font-bold text-black text-center">
        Your Enneagram Profile
      </h1>

      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-4xl text-3xl font-bold text-center mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
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
            margin={{ top: 0, right: 0, bottom: 0, left: 60 }}
          >
            <XAxis type="number" domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="name"
              width={60}
              tick={{ fill: '#666', fontSize: 14 }}
            />
            <Bar
              dataKey="normalizedValue"
              fill="#8884d8"
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-6 mt-8">
        <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          {dominantTypeDesc.title}
        </h3>
        
        <div className="prose max-w-none space-y-6">
          <section>
            <h4 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              In a Nutshell
            </h4>
            <p className="text-gray-700 mb-6">
              {dominantTypeDesc.inNutshell}
            </p>
            <div className="text-center mb-8">
              <a
                href={`https://www.integrative9.com/enneagram/introduction/type-${dominantType.replace('type', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Learn more about Type {dominantType.replace('type', '')} here
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Second and Third Highest Types */}
      <div className="mt-12 space-y-8">
        <h3 className="text-2xl font-semibold mt-8 mb-4">
          You also resonate with Type {secondType.replace('type', '')}: {TYPE_NAMES[secondType]} and Type {thirdType.replace('type', '')}: {TYPE_NAMES[thirdType]}
        </h3>

        {/* Second Highest Type */}
        <section className="space-y-6 bg-gray-50 p-6 rounded-lg">
          <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            {secondTypeDesc.title}
          </h4>
          <div className="space-y-6">
            <section>
              <h5 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                In a Nutshell
              </h5>
              <p className="text-gray-700 mb-6">
                {secondTypeDesc.inNutshell}
              </p>
              <div className="text-center mb-8">
                <a
                  href={`https://www.integrative9.com/enneagram/introduction/type-${secondType.replace('type', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Learn more about Type {secondType.replace('type', '')} here
                </a>
              </div>
            </section>
          </div>
        </section>

        {/* Third Highest Type */}
        <section className="space-y-6 bg-gray-50 p-6 rounded-lg">
          <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            {thirdTypeDesc.title}
          </h4>
          <div className="space-y-6">
            <section>
              <h5 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                In a Nutshell
              </h5>
              <p className="text-gray-700 mb-6">
                {thirdTypeDesc.inNutshell}
              </p>
              <div className="text-center mb-8">
                <a
                  href={`https://www.integrative9.com/enneagram/introduction/type-${thirdType.replace('type', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Learn more about Type {thirdType.replace('type', '')} here
                </a>
              </div>
            </section>
          </div>
        </section>
      </div>

      <Button 
        onClick={onClose} 
        className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-colors"
      >
        Take Quiz Again
      </Button>
    </Card>
  );
};

export default QuizResults;