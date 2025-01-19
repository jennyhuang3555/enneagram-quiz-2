import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingPage from "@/components/LandingPage";
import TestIntroduction from "@/components/TestIntroduction";
import Questions from "@/components/Questions";

type Step = "landing" | "introduction" | "questions";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("landing");

  const handleQuizComplete = (scores: number[]) => {
    console.log("Quiz completed with scores:", scores);
    // TODO: Implement results calculation and display
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
    </div>
  );
};

export default Index;