import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingPage from "@/components/LandingPage";
import TestIntroduction from "@/components/TestIntroduction";
import Questions from "@/components/Questions";
import QuizResults from "@/components/QuizResults";
import UserInfoForm from "@/components/UserInfoForm";
import { supabase } from "@/lib/supabase";
import { QuestionResponse } from "@/types/quiz";

type Step = "landing" | "introduction" | "questions" | "user-info" | "results";

// Sample quiz data - in a real app, this would come from your backend
const sampleQuiz = {
  id: "1",
  title: "Enneagram Test",
  description: "Discover your Enneagram type",
  questions: [],
  resultRanges: [
    {
      id: "1",
      category: "type1",
      minScore: 0,
      maxScore: 25,
      title: "Type 1: The Reformer",
      description: "Principled, purposeful, self-controlled, and perfectionistic"
    },
    {
      id: "2",
      category: "type2",
      minScore: 0,
      maxScore: 25,
      title: "Type 2: The Helper",
      description: "Generous, demonstrative, people-pleasing, and possessive"
    },
    // Add more types as needed
  ]
};

// Add this interface
interface UserResult {
  name: string;
  email: string;
  scores: { [key: string]: number };
  timestamp: string;
}

const Index = () => {
  const [step, setStep] = useState<Step>("landing");
  const [scores, setScores] = useState<{ [key: string]: number } | null>(null);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [dominantType, setDominantType] = useState<string>('');
  const [secondType, setSecondType] = useState<string>('');
  const [thirdType, setThirdType] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleQuizComplete = (
    newScores: { [key: string]: number }, 
    quizResponses: QuestionResponse[]
  ) => {
    setScores(newScores);
    setResponses(quizResponses);
    
    // Sort by score values (highest to lowest)
    const sortedTypes = Object.entries(newScores)
      .sort(([typeA, scoreA], [typeB, scoreB]) => {
        // If scores are equal, prefer the type closer to 1
        if (scoreB === scoreA) {
          const numA = parseInt(typeA.replace('type', ''));
          const numB = parseInt(typeB.replace('type', ''));
          return numA - numB;
        }
        return scoreB - scoreA;
      })
      .map(([type]) => type);
    
    setDominantType(sortedTypes[0]);
    setSecondType(sortedTypes[1]);
    setThirdType(sortedTypes[2]);
    
    setStep("user-info");
  };

  const handleUserInfoSubmit = async (userInfo: { name: string; email: string }) => {
    try {
      setError('');
      
      // If Supabase fails, we still want to show results
      try {
        const { data, error } = await supabase
          .from('quiz_results')
          .insert([{
            name: userInfo.name,
            email: userInfo.email,
            scores: scores || {},
            responses: responses,
            dominant_type: dominantType?.replace('type', '') || '',
            second_type: secondType?.replace('type', '') || '',
            third_type: thirdType?.replace('type', '') || '',
            created_at: new Date().toISOString()
          }])
          .select();

        if (error) {
          console.error('Supabase Error:', error);
          // Don't return - continue to show results
        }
      } catch (e) {
        console.error('Database error:', e);
        // Don't return - continue to show results
      }

      // Always proceed to results, even if save fails
      setStep('results');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {step === "landing" && (
        <LandingPage onStart={() => setStep("introduction")} />
      )}
      {step === "introduction" && (
        <TestIntroduction onStart={() => setStep("questions")} />
      )}
      {step === "questions" && (
        <Questions
          onComplete={handleQuizComplete}
          onBack={() => setStep("introduction")}
        />
      )}
      {step === "user-info" && (
        <UserInfoForm onSubmit={handleUserInfoSubmit} />
      )}
      {step === "results" && scores && (
        <QuizResults
          quiz={sampleQuiz}
          scores={scores}
          responses={responses}
          onClose={() => setStep("landing")}
        />
      )}
    </div>
  );
};

export default Index;