import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import QuizCreator from "@/components/QuizCreator";
import { useToast } from "@/components/ui/use-toast";
import { Quiz } from "@/types/quiz";

const Index = () => {
  const [step, setStep] = useState(1);
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
    // In a real app, we would save this to a database
    console.log("Created quiz:", quiz);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Create Your Quiz</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Design an interactive quiz experience
          </p>
        </div>

        <Card className="glass-card p-6">
          <QuizCreator onQuizCreate={handleQuizCreate} />
        </Card>
      </div>
    </div>
  );
};

export default Index;