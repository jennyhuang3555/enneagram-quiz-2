import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface TestIntroductionProps {
  onStart: () => void;
  onBack: () => void;
}

const TestIntroduction = ({ onStart, onBack }: TestIntroductionProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-2xl w-full p-8 glass-card space-y-6">
        <h2 className="text-3xl font-bold text-center">Before We Begin</h2>
        
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            This test will help you discover your Enneagram type through a series of carefully crafted questions.
          </p>
          
          <div className="bg-purple-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-purple-800">How it works:</h3>
            <ul className="space-y-2 text-purple-700">
              <li>• Answer each question honestly, reflecting on your life as a whole</li>
              <li>• There are no right or wrong answers</li>
              <li>• Your responses will determine your type calculation</li>
              <li>• The test takes about 15-20 minutes to complete</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <Button 
            onClick={onStart}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity"
          >
            Begin Test
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TestIntroduction;