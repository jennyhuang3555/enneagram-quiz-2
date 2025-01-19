import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QuizCreator from "@/components/QuizCreator";
import QuizPreview from "@/components/QuizPreview";
import { useToast } from "@/components/ui/use-toast";
import { Quiz } from "@/types/quiz";

const Index = () => {
  const [quizData, setQuizData] = useState<Quiz>({
    title: "",
    description: "",
    questions: [],
    resultRanges: []
  });
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleQuizCreate = (quiz: Quiz) => {
    setQuizData(quiz);
    toast({
      title: "Quiz Created!",
      description: "Your quiz has been created successfully.",
    });
  };

  const canPreview = quizData.questions.length > 0 && quizData.resultRanges.length > 0;

  if (showPreview) {
    return <QuizPreview quiz={quizData} onClose={() => setShowPreview(false)} />;
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
            onClick={() => setShowPreview(true)}
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