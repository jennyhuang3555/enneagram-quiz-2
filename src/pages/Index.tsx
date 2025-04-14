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
import TriadQuestions from "@/components/TriadQuestions";
import { triadQuestions } from '@/data/triad-questions';

type Step = "landing" | "introduction" | "quiz" | "user-info" | "results";

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
  const [quizSection, setQuizSection] = useState<1 | 2>(1);
  const [initialScores, setInitialScores] = useState<{ [key: string]: number } | null>(null);

  // Handle completion of section 1
  const handleSection1Complete = (
    newScores: { [key: string]: number },
    quizResponses: QuestionResponse[]
  ) => {
    setResponses(quizResponses);
    setInitialScores(newScores);
    
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
    
    // Set top three types
    setDominantType(sortedTypes[0]);
    setSecondType(sortedTypes[1]);
    setThirdType(sortedTypes[2]);
    
    // Move to section 2
    setQuizSection(2);
  };

  // Handle completion of section 2 (triad questions)
  const handleSection2Complete = (triadScores: { [key: string]: number }) => {
    // Combine scores from both sections
    const finalScores = { ...initialScores };
    Object.entries(triadScores).forEach(([type, score]) => {
      finalScores[type] = (finalScores[type] || 0) + score;
    });
    
    setScores(finalScores);
    
    // Re-sort based on final scores
    const sortedTypes = Object.entries(finalScores)
      .sort(([typeA, scoreA], [typeB, scoreB]) => {
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

  const renderCurrentStep = () => {
    switch (step) {
      case "landing":
        return <LandingPage onStart={() => setStep("introduction")} />;
      case "introduction":
        return (
          <TestIntroduction
            onStart={() => setStep("quiz")}
            onBack={() => setStep("landing")}
          />
        );
      case "quiz":
        return quizSection === 1 ? (
          <Questions
            onComplete={handleSection1Complete}
            onBack={() => setStep("introduction")}
            totalQuestions={sampleQuiz.questions.length + 3}
          />
        ) : (
          <TriadQuestions
            questions={triadQuestions}
            topThreeTypes={[dominantType, secondType, thirdType].map(type => 
              type.startsWith('type') ? type : `type${type}`
            )}
            onComplete={handleSection2Complete}
            totalQuestions={sampleQuiz.questions.length + 3}
            questionsCompleted={sampleQuiz.questions.length}
          />
        );
      case "user-info":
        return (
          <UserInfoForm
            onSubmit={handleUserInfoSubmit}
            onBack={() => setStep("quiz")}
          />
        );
      case "results":
        return scores ? (
          <QuizResults
            quiz={sampleQuiz}
            scores={scores}
            responses={responses}
            onClose={() => {
              setStep("landing");
              setScores(null);
              setResponses([]);
              setQuizSection(1);
              setInitialScores(null);
            }}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {renderCurrentStep()}
    </div>
  );
};

export default Index;