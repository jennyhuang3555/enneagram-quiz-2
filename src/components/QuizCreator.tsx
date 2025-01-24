import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Upload } from "lucide-react";
import { Quiz, Question, ResultRange } from "@/types/quiz";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import * as XLSX from 'xlsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import quizData from '@/data/quiz-questions.json';

interface QuizCreatorProps {
  onQuizCreate: (quiz: Quiz) => void;
}

const SCORE_OPTIONS = [
  { value: 1, label: "Not Me at All" },
  { value: 2, label: "Rarely Me" },
  { value: 3, label: "Sometimes Me" },
  { value: 4, label: "Often Me" },
  { value: 5, label: "Definitely Me" },
];

const QuizCreator = ({ onQuizCreate }: QuizCreatorProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>(
    quizData.questions.map(q => ({
      ...q,
      options: SCORE_OPTIONS.map((option) => ({
        id: crypto.randomUUID(),
        text: option.label,
        points: option.value,
      })),
    }))
  );
  const [resultRanges, setResultRanges] = useState<ResultRange[]>(quizData.resultRanges);
  const [category, setCategory] = useState("");

  // Log changes to questions
  useEffect(() => {
    if (questions.length > 0) {
      console.log(`Questions updated at ${new Date().toISOString()}:`, questions);
    }
  }, [questions]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        text: "",
        category: category,
        options: SCORE_OPTIONS.map((option) => ({
          id: crypto.randomUUID(),
          text: option.label,
          points: option.value,
        })),
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
        category: "",
      },
    ]);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
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
      resultRanges.map((r) => (r.id === rangeId ? { ...r, ...updates } : r))
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      const newQuestions = jsonData.map((row: any) => {
        let questionType = '';
        if (typeof row.Type === 'string') {
          questionType = row.Type;
        } else if (typeof row.type === 'string') {
          questionType = row.type;
        } else if (row.Type) {
          questionType = String(row.Type);
        } else if (row.type) {
          questionType = String(row.type);
        }

        return {
          id: crypto.randomUUID(),
          text: row.Question || row.question || '',
          category: questionType || 'uncategorized',
          options: SCORE_OPTIONS.map((option) => ({
            id: crypto.randomUUID(),
            text: option.label,
            points: option.value,
          })),
        };
      });

      setQuestions([...questions, ...newQuestions]);
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePasteData = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const pastedText = event.target.value;
    const rows = pastedText.split('\n').filter(row => row.trim());
    
    const newQuestions = rows.map(row => {
      const [question, type] = row.split('\t');
      return {
        id: crypto.randomUUID(),
        text: question?.trim() || '',
        category: type?.trim() || 'uncategorized',
        options: SCORE_OPTIONS.map((option) => ({
          id: crypto.randomUUID(),
          text: option.label,
          points: option.value,
        })),
      };
    });

    setQuestions([...questions, ...newQuestions]);
    event.target.value = '';
  };

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quiz Configuration</h2>
        
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Import Questions</h3>
          
          <div>
            <Label htmlFor="file-upload">Upload Excel File</Label>
            <div className="flex gap-2 items-center mt-1">
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="paste-data">Or Paste Table Data</Label>
            <Textarea
              id="paste-data"
              placeholder="Paste your questions and types here (tab-separated)"
              className="mt-1"
              onChange={handlePasteData}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Format: Question [tab] Type (one per line)
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Questions</h3>
            <div className="flex gap-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core Types</SelectItem>
                  <SelectItem value="motivations">Motivations</SelectItem>
                  <SelectItem value="fears">Fears</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addQuestion} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
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
                    <div className="space-y-2">
                      <Label>Question {index + 1}</Label>
                      <div className="text-sm text-muted-foreground">
                        Category: {question.category}
                      </div>
                    </div>
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
                    {question.options.map((option) => (
                      <div key={option.id} className="flex gap-2 items-center">
                        <div className="flex-grow">
                          <Input
                            value={option.text}
                            onChange={(e) =>
                              updateOption(question.id, option.id, {
                                text: e.target.value,
                              })
                            }
                            placeholder="Option text"
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            value={option.points}
                            onChange={(e) =>
                              updateOption(question.id, option.id, {
                                points: parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="Points"
                          />
                        </div>
                      </div>
                    ))}
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
    </div>
  );
};

export default QuizCreator;
