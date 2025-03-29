import React, { useState } from "react";
import { Card, CardHeader, Button } from "@heroui/react";
import { Plus, Upload, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import QuestionModal from "./AddQuestionModal";
import QuestionList from "./QuestionList";
import CSVImportModal from "./CsvImportModal";
import { toast } from "@/components/ui/use-toast";
import { Section, Question, QuestionType } from "@shared-types/MCQAssessment";

interface McqContentProps {
  selectedSection: Section;
  sections: Section[];
  setSections: (sections: Section[]) => void;
}

const McqContent: React.FC<McqContentProps> = ({
  selectedSection,
  sections,
  setSections,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCSVOpen, setCSVOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleAddQuestion = (newQuestion: Question) => {
    if (!selectedSection) return;
    const finalSection = sections;

    if (editingQuestion) {
      const currentSection = finalSection.find(
        (section) => section.name === selectedSection.name
      );

      if (currentSection) {
        currentSection.questions = currentSection.questions.map((q) =>
          q.question === editingQuestion.question ? newQuestion : q
        );
      }

      setEditingQuestion(null);
    } else {
      const currentSection = finalSection.find(
        (section) => section.name === selectedSection.name
      );

      if (currentSection) {
        currentSection.questions.push(newQuestion);
      }
    }
    setModalOpen(false);
  };

  const handleMoveUp = (questionText: string) => {
    if (!selectedSection) return;

    const questions = selectedSection.questions;
    const index = questions.findIndex(
      (q: Question) => q._id === questionText
    );

    if (index === -1) return;
    if (index > 0) {
      const newQuestions = [...questions];
      [newQuestions[index - 1], newQuestions[index]] = [
        newQuestions[index],
        newQuestions[index - 1],
      ];

      const finalSections = sections.map((section) =>
        section.name === selectedSection.name
          ? { ...section, questions: newQuestions }
          : section
      );

      setSections(finalSections);
    }
  };

  const handleMoveDown = (questionText: string) => {
    if (!selectedSection) return;

    const questions = selectedSection.questions;
    const index = questions.findIndex((q: Question) => q._id === questionText);

    if (index === -1) return;
    if (index < questions.length - 1) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index + 1]] = [
        newQuestions[index + 1],
        newQuestions[index],
      ];

      const finalSections = sections.map((section) =>
        section.name === selectedSection.name
          ? { ...section, questions: newQuestions }
          : section
      );

      setSections(finalSections);
    }
  };

  const handleEdit = (index: number) => {
    if (!selectedSection) return;

    const question = selectedSection.questions.find((_, i) => i === index);
    if (question) {
      setEditingQuestion(question);
      setModalOpen(true);
    }
  };

  const handleDelete = (index: number) => {
    if (!selectedSection) return;
    console.log(index);
    const finalSections = sections.map((section) =>
      section.name === selectedSection.name
        ? {
            ...section,
            questions: section.questions.filter((_, i) => i !== index),
          }
        : section
    );

    setSections(finalSections);
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
    const requiredHeaders = ["type", "question"];

    if (!requiredHeaders.every((header) => headers.includes(header))) {
      toast({
        description: "CSV must contain 'type' and 'question' columns.",
        variant: "destructive",
      });
      return [];
    }

    try {
      return rows.slice(1).map((row) => {
        const values = row.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
        const cleanValue = (val: string) =>
          val.trim().replace(/^"|"$/g, "").replace(/""/g, '"');

        const type = cleanValue(values[0] || "") as QuestionType;
        const question = cleanValue(values[1]);
        const grade = cleanValue(values[3])
          ? parseInt(cleanValue(values[3]), 10)
          : 1;

        const baseQuestion: Question = {
          question,
          type,
          grade,
        };

        switch (type) {
          case "single-select":
          case "multi-select":
          case "matching":
            if (values[2]) {
              try {
                baseQuestion.options = JSON.parse(cleanValue(values[2]));
              } catch {
                toast({
                  description: `Invalid options for ${type} question.`,
                  variant: "destructive",
                });
              }
            }
            break;

          case "true-false":
            baseQuestion.options = [
              { option: "True", isCorrect: false },
              { option: "False", isCorrect: false },
            ];
            break;

          case "short-answer":
          case "long-answer":
            if (values[2]) {
              baseQuestion.maxCharactersAllowed = parseInt(
                cleanValue(values[2]),
                10
              );
            }
            break;

          case "visual":
            if (values[2]) {
              baseQuestion.imageSource = cleanValue(values[2]);
            }
            break;

          case "fill-in-blanks":
            if (values[2]) {
              baseQuestion.fillInBlankAnswers = JSON.parse(
                cleanValue(values[2])
              );
            }
            break;
        }

        return baseQuestion;
      });
    } catch {
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
          const finalSections = sections.map((section) =>
            section.name === selectedSection.name
              ? {
                  ...section,
                  questions: [...section.questions, ...newQuestions],
                }
              : section
          );

          setSections(finalSections);

          toast({
            description: `Successfully imported ${newQuestions.length} questions.`,
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
      <Card className="h-full rounded-xl shadow-none overflow-y-auto">
        {selectedSection ? (
          <div className="p-1">
            <CardHeader className="flex flex-row items-center justify-between px-2">
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedSection.name}
                  <span className="text-sm text-gray-500 ml-2">
                    ({selectedSection.questions.length})
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
                {selectedSection.questions.length > 0 ? (
                  <QuestionList
                    questions={selectedSection.questions}
                    onMoveUp={(q) => handleMoveUp(q.toString())}
                    onMoveDown={(q) => handleMoveDown(q.toString())}
                    onEdit={(q) => handleEdit(q)}
                    onDelete={(q) => handleDelete(q)}
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
        editingQuestion={editingQuestion}
      />

      <CSVImportModal isOpen={isCSVOpen} onClose={() => setCSVOpen(false)} />
    </motion.div>
  );
};

export default McqContent;
