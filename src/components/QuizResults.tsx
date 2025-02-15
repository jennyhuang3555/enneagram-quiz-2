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

const QuizResults = ({ quiz, scores, responses, onClose }: QuizResultsProps) => {
  // At the top of the component, calculate the actual order by scores
  const typesByScore = Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([type]) => type);

  const dominantType = typesByScore[0];
  const secondType = typesByScore[1];
  const thirdType = typesByScore[2];

  // Log for verification
  console.log('Types by score:', {
    scores,
    typesByScore,
    dominant: dominantType,
    second: secondType,
    third: thirdType
  });

  // Use these for the descriptions
  const dominantTypeDesc = typeDescriptions[dominantType as keyof typeof typeDescriptions];
  const secondTypeDesc = typeDescriptions[secondType as keyof typeof typeDescriptions];
  const thirdTypeDesc = typeDescriptions[thirdType as keyof typeof typeDescriptions];

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
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
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
            <p className="text-xl text-gray-600">{dominantTypeDesc.inNutshell}</p>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Motivation and Core Fears
            </h4>
            <p className="text-xl text-gray-600">{dominantTypeDesc.motivationAndFears}</p>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Worldview and Focus of Attention
            </h4>
            <p className="text-xl text-gray-600">{dominantTypeDesc.worldview}</p>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Blind Spots
            </h4>
            <ul className="list-disc pl-5 space-y-3">
              {dominantTypeDesc.blindSpots.map((item, index) => (
                <li key={index} className="text-xl text-gray-600">{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Strengths and Gifts
            </h4>
            <ul className="list-disc pl-5 space-y-3">
              {dominantTypeDesc.strengths.map((item, index) => (
                <li key={index} className="text-xl text-gray-600">{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Triggers
            </h4>
            <ul className="list-disc pl-5 space-y-3">
              {dominantTypeDesc.triggers.map((item, index) => (
                <li key={index} className="text-xl text-gray-600">{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Challenging Patterns
            </h4>
            <ul className="list-disc pl-5 space-y-3">
              {dominantTypeDesc.challengingPatterns.map((item, index) => (
                <li key={index} className="text-xl text-gray-600">{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Growth Questions
            </h4>
            <p className="text-xl text-gray-600 mb-4">{dominantTypeDesc.growthDescription}</p>
            <ul className="list-disc pl-5 space-y-3">
              {dominantTypeDesc.growthQuestions.slice(2).map((item, index) => (
                <li key={index} className="text-xl text-gray-600">{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Second and Third Highest Types */}
      <div className="mt-12 space-y-8">
        <h3 className="text-3xl font-semibold text-gray-700">
          You also resonate with Type {secondTypeDesc.title} and Type {thirdTypeDesc.title}
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
              <p className="text-lg text-gray-600">
                {secondTypeDesc.inNutshell}
              </p>
            </section>
            
            <section>
              <h5 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Motivation and Core Fears
              </h5>
              <p className="text-lg text-gray-600">
                {secondTypeDesc.motivationAndFears}
              </p>
            </section>
            
            <section>
              <h5 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Worldview and Focus of Attention
              </h5>
              <p className="text-lg text-gray-600">
                {secondTypeDesc.worldview}
              </p>
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
              <p className="text-lg text-gray-600">
                {thirdTypeDesc.inNutshell}
              </p>
            </section>
            
            <section>
              <h5 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Motivation and Core Fears
              </h5>
              <p className="text-lg text-gray-600">
                {thirdTypeDesc.motivationAndFears}
              </p>
            </section>
            
            <section>
              <h5 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Worldview and Focus of Attention
              </h5>
              <p className="text-lg text-gray-600">
                {thirdTypeDesc.worldview}
              </p>
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