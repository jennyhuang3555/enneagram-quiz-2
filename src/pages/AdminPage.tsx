import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import QuizCreator from "@/components/QuizCreator";
import { Quiz } from "@/types/quiz";
import { useToast } from "@/components/ui/use-toast";

const AdminPage = () => {
  const { toast } = useToast();

  const handleQuizCreate = (quiz: Quiz) => {
    // Here you would typically save the quiz to your backend
    console.log("Created quiz:", quiz);
    toast({
      title: "Quiz Created",
      description: "Your quiz has been successfully created.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quiz Admin Panel</h1>
          <Link to="/">
            <Button variant="outline">Back to Quiz</Button>
          </Link>
        </div>
        <QuizCreator onQuizCreate={handleQuizCreate} />
      </div>
    </div>
  );
};

export default AdminPage;