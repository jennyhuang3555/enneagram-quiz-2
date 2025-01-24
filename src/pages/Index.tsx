import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingPage from "@/components/LandingPage";
import TestIntroduction from "@/components/TestIntroduction";
import Questions from "@/components/Questions";
import QuizResults from "@/components/QuizResults";
import UserInfoForm from "@/components/UserInfoForm";
import { supabase } from "@/lib/supabase";

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
  const [currentStep, setCurrentStep] = useState<Step>("landing");
  const [quizScores, setQuizScores] = useState<{ [key: string]: number }>({});
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);

  const handleQuizComplete = (scores: { [key: string]: number }) => {
    setQuizScores(scores);
    setCurrentStep("user-info");
  };

  const handleUserInfoSubmit = async (name: string, email: string) => {
    const result = {
      name,
      email,
      scores: quizScores,
    };

    console.log('Submitting result:', result);

    try {
      const { error, data } = await supabase
        .from('quiz_results')
        .insert([result]);

      console.log('Supabase response:', { error, data });

      if (error) {
        throw error;
      }

      setUserInfo({ name, email });
      setCurrentStep("results");
    } catch (error) {
      console.error('Error submitting results:', error);
      alert('Failed to save results. Please try again.');
    }
  };

  return (
    <div>
    
      
      {currentStep === "landing" && (
        <LandingPage onStart={() => setCurrentStep("introduction")} />
      )}
      
      {currentStep === "introduction" && (
        <TestIntroduction
          onStart={() => setCurrentStep("questions")}
          onBack={() => setCurrentStep("landing")}
        />
      )}
      
      {currentStep === "questions" && (
        <Questions
          onComplete={handleQuizComplete}
          onBack={() => setCurrentStep("introduction")}
        />
      )}

      {currentStep === "user-info" && (
        <UserInfoForm
          scores={quizScores}
          onSubmit={handleUserInfoSubmit}
        />
      )}

      {currentStep === "results" && (
        <QuizResults
          quiz={sampleQuiz}
          scores={quizScores}
          onClose={() => setCurrentStep("landing")}
        />
      )}
    </div>
  );
};

export default Index;