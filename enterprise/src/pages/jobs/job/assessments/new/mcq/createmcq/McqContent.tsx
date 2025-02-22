import React, { useState } from "react";
import { Card, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Plus, Upload, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import QuestionModal from "./AddQuestionModal";
import QuestionList from "./QuestionList";
import CSVImportModal from "./CsvImportModal";
import { toast } from "@/components/ui/use-toast";

export type QuestionType =
  | "single-select"
  | "multi-select"
  | "true-false"
  | "short-answer"
  | "long-answer"
  | "fill-in-blanks"
  | "matching"
  | "output"
  | "visual"
  | "peer-review";

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: { id: number; text: string; isCorrect: boolean }[];
  maxLimit?: number;
  imageUrl?: string;
  code?: string;
  blankText?: string;
  blanksAnswers?: string[];
}

interface SectionQuestions {
  [sectionId: number]: Question[];
}

interface McqContentProps {
  selectedSection: { id: number; name: string } | null;
}

const McqContent: React.FC<McqContentProps> = ({ selectedSection }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCSVOpen, setCSVOpen] = useState(false);
  const [sectionQuestions, setSectionQuestions] = useState<SectionQuestions>(
    {}
  );
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const currentQuestions = selectedSection
    ? sectionQuestions[selectedSection.id] || []
    : [];

  const handleAddQuestion = (newQuestion: Question) => {
    if (!selectedSection) return;

    if (editingQuestion) {
      setSectionQuestions((prev) => ({
        ...prev,
        [selectedSection.id]: prev[selectedSection.id].map((q) =>
          q.id === editingQuestion.id ? newQuestion : q
        ),
      }));
      setEditingQuestion(null);
    } else {
      setSectionQuestions((prev) => ({
        ...prev,
        [selectedSection.id]: [
          ...(prev[selectedSection.id] || []),
          newQuestion,
        ],
      }));
    }
    setModalOpen(false);
  };

  const handleMoveUp = (id: number) => {
    if (!selectedSection) return;

    const questions = currentQuestions;
    const index = questions.findIndex((q) => q.id === id);
    if (index > 0) {
      const newQuestions = [...questions];
      [newQuestions[index - 1], newQuestions[index]] = [
        newQuestions[index],
        newQuestions[index - 1],
      ];
      setSectionQuestions((prev) => ({
        ...prev,
        [selectedSection.id]: newQuestions,
      }));
    }
  };

  const handleMoveDown = (id: number) => {
    if (!selectedSection) return;

    const questions = currentQuestions;
    const index = questions.findIndex((q) => q.id === id);
    if (index < questions.length - 1) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index + 1]] = [
        newQuestions[index + 1],
        newQuestions[index],
      ];
      setSectionQuestions((prev) => ({
        ...prev,
        [selectedSection.id]: newQuestions,
      }));
    }
  };

  const handleEdit = (id: number) => {
    if (!selectedSection) return;

    const question = currentQuestions.find((q) => q.id === id);
    if (question) {
      setEditingQuestion(question);
      setModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    if (!selectedSection) return;

    setSectionQuestions((prev) => ({
      ...prev,
      [selectedSection.id]: prev[selectedSection.id].filter((q) => q.id !== id),
    }));
  };

  const validateAndParseCSV = (text: string): Question[] => {
    const rows = text.split("\n").filter((row) => row.trim() !== "");
    if (rows.length < 2) {
      toast({
        description:
          "Invalid CSV format. Ensure you have a header and at least one data row.",
        variant: "destructive",
      });
      return [];
    }

    const headers = rows[0].split(",");
    const requiredHeaders = ["type", "text"];

    if (!requiredHeaders.every((header) => headers.includes(header))) {
      toast({
        description: "CSV must contain 'type' and 'text' columns.",
        variant: "destructive",
      });
      return [];
    }

    try {
      return rows.slice(1).map((row, index) => {
        const values = row.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];

        const cleanValue = (val: string) =>
          val.trim().replace(/^"|"$/g, "").replace(/""/g, '"');

        const type = cleanValue(values[0] || "") as Question["type"];
        const text = cleanValue(values[1]);

        const baseQuestion: Question = {
          id: Date.now() + index,
          type,
          text,
        };

        switch (type) {
          case "single-select":
          case "multi-select":
          case "matching":
          case "output":
            if (values[2]) {
              try {
                baseQuestion.options = JSON.parse(cleanValue(values[2]));
              } catch (e) {
                toast({
                  description: `Invalid options for ${type} question`,
                  variant: "destructive",
                });
              }
            }
            break;

          case "true-false":
            baseQuestion.options = [
              { id: 1, text: "True", isCorrect: false },
              { id: 2, text: "False", isCorrect: false },
            ];
            break;

          case "short-answer":
          case "long-answer":
            if (values[2]) {
              baseQuestion.maxLimit = parseInt(cleanValue(values[2]), 10);
            }
            break;

          case "visual":
            if (values[2]) {
              baseQuestion.imageUrl = cleanValue(values[2]);
            }
            break;

          case "peer-review":
            if (values[2]) {
              baseQuestion.code = cleanValue(values[2]);
            }
            break;

          case "fill-in-blanks":
            if (values[2] && values[3]) {
              baseQuestion.blankText = cleanValue(values[2]);
              try {
                baseQuestion.blanksAnswers = JSON.parse(cleanValue(values[3]));
              } catch (e) {
                toast({
                  description: "Invalid blanks answers",
                  variant: "destructive",
                });
              }
            }
            break;
        }

        return baseQuestion;
      });
    } catch (error) {
      toast({
        description: "Error parsing CSV. Please check your format.",
        variant: "destructive",
      });
      return [];
    }
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedSection) return;

    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const newQuestions = validateAndParseCSV(text);

        if (newQuestions.length > 0) {
          setSectionQuestions((prev) => ({
            ...prev,
            [selectedSection.id]: [
              ...(prev[selectedSection.id] || []),
              ...newQuestions,
            ],
          }));
          toast({
            description: `Successfully imported ${newQuestions.length} questions`,
            variant: "default",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-[80%]"
    >
      <Card className="h-full rounded-xl">
        {selectedSection ? (
          <div className="p-1">
            <CardHeader className="flex flex-row items-center justify-between px-2">
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedSection.name}
                  <span className="text-sm text-gray-500 ml-2">
                    ({currentQuestions.length})
                  </span>
                </h2>
                <p className="text-sm text-gray-500">
                  Setup MCQ questions for {selectedSection.name}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  variant="light"
                  color="primary"
                  onClick={() => setCSVOpen(true)}
                >
                  <HelpCircle size={18} />
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button
                    as="label"
                    htmlFor="csv-upload"
                    startContent={<Upload size={16} />}
                    variant="bordered"
                  >
                    Import CSV
                  </Button>
                </div>
                <Button
                  startContent={<Plus size={16} />}
                  color="primary"
                  onClick={() => {
                    setEditingQuestion(null);
                    setModalOpen(true);
                  }}
                >
                  Add Question
                </Button>
              </div>
            </CardHeader>

            <div className="flex-grow overflow-auto px-2">
              <div className="h-full overflow-auto">
                {currentQuestions.length > 0 ? (
                  <QuestionList
                    questions={currentQuestions}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No questions added yet. Click "Add Question" to get
                      started.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">
              Select a section to view its content
            </p>
          </div>
        )}
      </Card>

      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingQuestion(null);
        }}
        onAddQuestion={handleAddQuestion}
        editingQuestion={editingQuestion!}
      />

      <CSVImportModal isOpen={isCSVOpen} onClose={() => setCSVOpen(false)} />
    </motion.div>
  );
};

export default McqContent;
