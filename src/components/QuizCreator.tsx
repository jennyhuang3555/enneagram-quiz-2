import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Quiz, Question, ResultRange } from "@/types/quiz";
import { CSSTransition, TransitionGroup } from "react-transition-group";

interface QuizCreatorProps {
  onQuizCreate: (quiz: Quiz) => void;
}

const QuizCreator = ({ onQuizCreate }: QuizCreatorProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [resultRanges, setResultRanges] = useState<ResultRange[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        text: "",
        options: [
          { id: crypto.randomUUID(), text: "", points: 0 },
          { id: crypto.randomUUID(), text: "", points: 0 },
        ],
      },
    ]);
  };

  const addResultRange = () => {
    setResultRanges([
      ...resultRanges,
      {
        id: crypto.randomUUID(),
        minScore: 0,
        maxScore: 0,
        title: "",
        description: "",
      },
    ]);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    );
  };

  const updateOption = (
    questionId: string,
    optionId: string,
    updates: Partial<{ text: string; points: number }>
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, ...updates } : o
              ),
            }
          : q
      )
    );
  };

  const updateResultRange = (rangeId: string, updates: Partial<ResultRange>) => {
    setResultRanges(
      resultRanges.map((r) =>
        r.id === rangeId ? { ...r, ...updates } : r
      )
    );
  };

  const handleSubmit = () => {
    const quiz: Quiz = {
      title,
      description,
      questions,
      resultRanges,
    };
    onQuizCreate(quiz);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Quiz Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
            placeholder="Enter quiz title"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
            placeholder="Enter quiz description"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Questions</h3>
          <Button onClick={addQuestion} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        <TransitionGroup className="space-y-4">
          {questions.map((question, index) => (
            <CSSTransition
              key={question.id}
              timeout={500}
              classNames="quiz-transition"
            >
              <Card className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <Label>Question {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setQuestions(questions.filter((q) => q.id !== question.id))
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={question.text}
                  onChange={(e) =>
                    updateQuestion(question.id, { text: e.target.value })
                  }
                  placeholder="Enter question text"
                />
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={option.id} className="flex gap-2">
                      <Input
                        value={option.text}
                        onChange={(e) =>
                          updateOption(question.id, option.id, {
                            text: e.target.value,
                          })
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <Input
                        type="number"
                        value={option.points}
                        onChange={(e) =>
                          updateOption(question.id, option.id, {
                            points: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="Points"
                        className="w-24"
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateQuestion(question.id, {
                        options: [
                          ...question.options,
                          { id: crypto.randomUUID(), text: "", points: 0 },
                        ],
                      })
                    }
                  >
                    Add Option
                  </Button>
                </div>
              </Card>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Result Ranges</h3>
          <Button onClick={addResultRange} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Range
          </Button>
        </div>

        <TransitionGroup className="space-y-4">
          {resultRanges.map((range, index) => (
            <CSSTransition
              key={range.id}
              timeout={500}
              classNames="quiz-transition"
            >
              <Card className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <Label>Range {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setResultRanges(resultRanges.filter((r) => r.id !== range.id))
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Min Score</Label>
                    <Input
                      type="number"
                      value={range.minScore}
                      onChange={(e) =>
                        updateResultRange(range.id, {
                          minScore: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Max Score</Label>
                    <Input
                      type="number"
                      value={range.maxScore}
                      onChange={(e) =>
                        updateResultRange(range.id, {
                          maxScore: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Result Title</Label>
                  <Input
                    value={range.title}
                    onChange={(e) =>
                      updateResultRange(range.id, { title: e.target.value })
                    }
                    placeholder="Enter result title"
                  />
                </div>
                <div>
                  <Label>Result Description</Label>
                  <Textarea
                    value={range.description}
                    onChange={(e) =>
                      updateResultRange(range.id, { description: e.target.value })
                    }
                    placeholder="Enter result description"
                  />
                </div>
              </Card>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Create Quiz
      </Button>
    </div>
  );
};

export default QuizCreator;