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

  const handleQuizComplete = (
    newScores: { [key: string]: number }, 
    quizResponses: QuestionResponse[]
  ) => {
    setScores(newScores);
    setResponses(quizResponses);
    
    // Calculate types (keep the full 'type' prefix)
    const sortedTypes = Object.entries(newScores)
      .sort(([, a], [, b]) => b - a)
      .map(([type]) => type);
    
    setDominantType(sortedTypes[0]);  // This will be like 'type1'
    setSecondType(sortedTypes[1]);    // This will be like 'type2'
    setThirdType(sortedTypes[2]);     // This will be like 'type3'
    
    setStep("user-info");
  };

  const handleUserInfoSubmit = async (userInfo: { name: string; email: string }) => {
    console.log('Types before submission:', {
      dominant: dominantType,
      second: secondType,
      third: thirdType
    });

    const payload = {
      name: userInfo.name,
      email: userInfo.email,
      scores: scores || {},
      responses: responses,
      dominant_type: dominantType?.replace('type', '') || '',  // Will now correctly be just the number
      second_type: secondType?.replace('type', '') || '',      // Will now correctly be just the number
      third_type: thirdType?.replace('type', '') || '',        // Will now correctly be just the number
      created_at: new Date().toISOString()
    };

    console.log('Submitting payload:', JSON.stringify(payload, null, 2));

    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .insert([payload])
        .select();

      if (error) {
        console.error('Supabase Error:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Successfully saved results:', data);
      setStep('results');
    } catch (error) {
      console.error('Error submitting results:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
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