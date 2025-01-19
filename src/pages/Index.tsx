import { useState } from "react";
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

  if (currentStep === "landing") {
    return <LandingPage onStart={() => setCurrentStep("introduction")} />;
  }

  if (currentStep === "introduction") {
    return (
      <TestIntroduction
        onStart={() => setCurrentStep("questions")}
        onBack={() => setCurrentStep("landing")}
      />
    );
  }

  return (
    <Questions
      onComplete={handleQuizComplete}
      onBack={() => setCurrentStep("introduction")}
    />
  );
};

export default Index;