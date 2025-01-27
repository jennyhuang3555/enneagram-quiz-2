import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface UserInfoFormProps {
  onSubmit: (userInfo: { name: string; email: string }) => void;
}

const UserInfoForm = ({ onSubmit }: UserInfoFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting user info:', { name, email });
    onSubmit({ name, email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl p-12 space-y-8 animate-fade-in bg-white/95 backdrop-blur">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Almost there!
        </h2>
        <p className="text-xl text-gray-600 text-center">
          Enter your email to see your results on the next page
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="text-2xl p-6 placeholder:text-xl placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-2xl p-6 placeholder:text-xl placeholder:text-gray-400"
            />
          </div>
          <Button 
            type="submit"
            className="w-full text-xl py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
          >
            View My Results
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default UserInfoForm; 