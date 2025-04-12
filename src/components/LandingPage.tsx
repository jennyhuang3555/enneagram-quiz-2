import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const LandingPage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8 animate-fade-in">
      <Card className="max-w-2xl w-full p-8 glass-card space-y-6">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Discover Your Enneagram Type
        </h1>
        
        <div className="space-y-4 text-center">
          <p className="text-lg text-gray-700">
          Uncover insights about your inner world with the Enneagram - a framework that maps nine distinct paths to personal growth and self-awareness. 
          </p>
          
          <ul className="text-left space-y-2 text-gray-600">
            <li>✨ Gain insights into core drives, motivations and underlying patterns </li>
            <li>🎯 Discover natural strengths as well as triggers, challenges and blind spots</li>
            <li>🌱 Improve how you communicate, manage conflict, and make decisions</li>
            <li>💫 Work towards greater self-awareness, resilience, and emotional intelligence</li>
          </ul>
        </div>

        <Button 
          onClick={onStart}
          className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity"
        >
          Take the Assessment
          <ArrowRight className="ml-2" />
        </Button>
      </Card>
    </div>
  );
};

export default LandingPage;