import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QuizCreator from "@/components/QuizCreator";
import QuizPreview from "@/components/QuizPreview";
import { useToast } from "@/components/ui/use-toast";
import { Quiz } from "@/types/quiz";
import LandingPage from "@/components/LandingPage";
import TestIntroduction from "@/components/TestIntroduction";

type Step = "landing" | "introduction" | "creator" | "preview";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("landing");
  const [quizData, setQuizData] = useState<Quiz>({
    title: "",
    description: "",
    questions: [],
    resultRanges: []
  });
  const { toast } = useToast();

  const handleQuizCreate = (quiz: Quiz) => {
    setQuizData(quiz);
    toast({
      title: "Quiz Created!",
      description: "Your quiz has been created successfully.",
    });
  };

  const canPreview = quizData.questions.length > 0 && quizData.resultRanges.length > 0;

  if (currentStep === "preview") {
    return <QuizPreview quiz={quizData} onClose={() => setCurrentStep("creator")} />;
  }

  if (currentStep === "landing") {
    return <LandingPage onStart={() => setCurrentStep("introduction")} />;
  }

  if (currentStep === "introduction") {
    return (
      <TestIntroduction 
        onStart={() => setCurrentStep("creator")}
        onBack={() => setCurrentStep("landing")}
      />
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Create Your Quiz</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Design an interactive quiz experience
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => setCurrentStep("preview")}
            disabled={!canPreview}
            variant="outline"
          >
            Preview Quiz
          </Button>
        </div>

        <Card className="p-6">
          <QuizCreator onQuizCreate={handleQuizCreate} />
        </Card>
      </div>
    </div>
  );
};

export default Index;