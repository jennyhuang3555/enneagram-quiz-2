import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingPage from "@/components/LandingPage";
import TestIntroduction from "@/components/TestIntroduction";
import Questions from "@/components/Questions";
import QuizResults from "@/components/QuizResults";

type Step = "landing" | "introduction" | "questions" | "results";

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

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("landing");
  const [quizScores, setQuizScores] = useState<{ [key: string]: number }>({});

  const handleQuizComplete = (scores: number[]) => {
    // Convert the array of scores into an object with type categories
    const scoresByType = {
      type1: scores[0] || 0,
      type2: scores[1] || 0,
      type3: scores[2] || 0,
      type4: scores[3] || 0,
      type5: scores[4] || 0,
    };
    
    setQuizScores(scoresByType);
    setCurrentStep("results");
  };

  return (
    <div>
      <div className="absolute top-4 right-4">
        <Link to="/admin">
          <Button variant="outline">Admin Panel</Button>
        </Link>
      </div>
      
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