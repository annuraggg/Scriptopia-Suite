import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input, Textarea } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Radio, RadioGroup } from "@heroui/radio";
import { Plus } from "lucide-react";
import MonacoEditor from "@monaco-editor/react";

const questionTypes: string[] = [
  "single-select",
  "multi-select",
  "true-false",
  "short-answer",
  "long-answer",
  "visual",
  "peer-review",
  "output",
  "fill-in-blanks",
  "matching",
];

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
  matchText?: string;
}

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

type QuestionType =
  | "single-select"
  | "multi-select"
  | "true-false"
  | "short-answer"
  | "long-answer"
  | "visual"
  | "peer-review"
  | "output"
  | "fill-in-blanks"
  | "matching";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (question: Question) => void;
  editingQuestion?: Question;
}

const QuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  onAddQuestion,
  editingQuestion,
}) => {
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [code, setCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [maxLimit, setMaxLimit] = useState<number>(70);
  const [blankText, setBlankText] = useState("");
  const [blanksAnswers, setBlanksAnswers] = useState<string[]>([]);
  const [selectedCorrectOption, setSelectedCorrectOption] =
    useState<string>("");

  useEffect(() => {
    if (editingQuestion) {
      setSelectedType(editingQuestion.type);
      setQuestionText(editingQuestion.text);
      setOptions(editingQuestion.options || []);
      setCode(editingQuestion.code || "");
      setImageUrl(editingQuestion.imageUrl || "");
      setMaxLimit(editingQuestion.maxLimit || 70);
      setBlankText(editingQuestion.blankText || "");
      setBlanksAnswers(editingQuestion.blanksAnswers || []);

      const correctOption = editingQuestion.options?.find(
        (opt) => opt.isCorrect
      );
      if (correctOption) {
        setSelectedCorrectOption(correctOption.id.toString());
      }
    }
  }, [editingQuestion]);

  const resetForm = () => {
    setSelectedType(null);
    setQuestionText("");
    setOptions([]);
    setCode("");
    setImageUrl("");
    setMaxLimit(70);
    setBlankText("");
    setBlanksAnswers([]);
    setSelectedCorrectOption("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddOption = () => {
    const newOption: Option = {
      id: options.length + 1,
      text: "",
      isCorrect: false,
      matchText: selectedType === "matching" ? "" : undefined,
    };
    setOptions([...options, newOption]);
  };

  const handleOptionChange = (
    id: number,
    field: "text" | "matchText" | "isCorrect",
    value: string | boolean
  ) => {
    if (selectedType === "single-select" && field === "isCorrect") {
      setOptions(
        options.map((opt) => ({
          ...opt,
          isCorrect: opt.id === id,
        }))
      );
      setSelectedCorrectOption(id.toString());
    } else {
      setOptions(
        options.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
      );
    }
  };

  const handleRadioChange = (value: string) => {
    const selectedId = parseInt(value);
    setSelectedCorrectOption(value);
    setOptions(
      options.map((opt) => ({
        ...opt,
        isCorrect: opt.id === selectedId,
      }))
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlankTextChange = (text: string) => {
    setBlankText(text);
    const blanks = text.match(/_{3,}/g) || [];
    setBlanksAnswers(Array(blanks.length).fill(""));
  };

  const handleSaveQuestion = () => {
    if (!selectedType || !questionText) return;

    const newQuestion: Question = {
      id: editingQuestion ? editingQuestion.id : Date.now(),
      type: selectedType,
      text: questionText,
    };

    switch (selectedType) {
      case "single-select":
      case "multi-select":
      case "matching":
      case "output":
        newQuestion.options = options;
        break;
      case "true-false":
        newQuestion.options = [
          { id: 1, text: "True", isCorrect: false },
          { id: 2, text: "False", isCorrect: false },
        ];
        break;
      case "short-answer":
      case "long-answer":
        newQuestion.maxLimit = maxLimit;
        break;
      case "visual":
        newQuestion.imageUrl = imageUrl;
        break;
      case "peer-review":
      case "fill-in-blanks":
        newQuestion.blankText = blankText;
        newQuestion.blanksAnswers = blanksAnswers;
        break;
    }

    onAddQuestion(newQuestion);
    handleClose();
  };

  const renderQuestionContent = () => {
    switch (selectedType) {
      case "single-select":
        return (
          <div className="space-y-4">
            <RadioGroup
              value={selectedCorrectOption}
              onValueChange={handleRadioChange}
              label="Select correct answer"
            >
              {options.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    className="flex-1"
                    label={`Option ${option.id}`}
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(option.id, "text", e.target.value)
                    }
                  />
                  <Radio value={option.id.toString()}>Correct</Radio>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "multi-select":
        return (
          <div className="space-y-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  label={`Option ${option.id}`}
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(option.id, "text", e.target.value)
                  }
                />
                <Checkbox
                  isSelected={option.isCorrect}
                  onValueChange={(checked) =>
                    handleOptionChange(option.id, "isCorrect", checked)
                  }
                >
                  Correct
                </Checkbox>
              </div>
            ))}
          </div>
        );

      case "true-false":
        return (
          <RadioGroup>
            <Radio value="true">True</Radio>
            <Radio value="false">False</Radio>
          </RadioGroup>
        );

      case "short-answer":
      case "long-answer":
        return (
          <Input
            type="number"
            label="Maximum Character Limit"
            value={maxLimit.toString()}
            onChange={(e) => setMaxLimit(Number(e.target.value))}
            className="mt-4"
          />
        );

      case "visual":
        return (
          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="mt-4 max-w-xs" />
            )}
          </div>
        );

      case "peer-review":
      case "output":
        return (
          <div className="mt-4">
            <MonacoEditor
              height="200px"
              language="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        );

      case "matching":
        return (
          <div className="space-y-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  label={`Option ${option.id}`}
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(option.id, "text", e.target.value)
                  }
                />
                <Input
                  className="flex-1"
                  label={`Match ${option.id}`}
                  value={option.matchText}
                  onChange={(e) =>
                    handleOptionChange(option.id, "matchText", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        );

      case "fill-in-blanks":
        return (
          <div className="space-y-4">
            <Textarea
              label="Enter text with blanks (use ___ for blanks)"
              value={blankText}
              onChange={(e) => handleBlankTextChange(e.target.value)}
            />
            {blanksAnswers.map((answer, index) => (
              <Input
                key={index}
                label={`Answer for blank ${index + 1}`}
                value={answer}
                onChange={(e) => {
                  const newAnswers = [...blanksAnswers];
                  newAnswers[index] = e.target.value;
                  setBlanksAnswers(newAnswers);
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          {editingQuestion ? "Edit Question" : "Add New Question"}
        </ModalHeader>
        <ModalBody>
          <Select
            label="Question Type"
            placeholder="Select a question type"
            selectedKeys={selectedType ? [selectedType] : []}
            onChange={(e) => setSelectedType(e.target.value as QuestionType)}
            isDisabled={!!editingQuestion}
          >
            {questionTypes.map((type) => (
              <SelectItem key={type}>
                {type
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </SelectItem>
            ))}
          </Select>

          {selectedType && (
            <Input
              label="Question Text"
              placeholder="Enter your question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="mt-4"
            />
          )}

          {renderQuestionContent()}
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-between w-full">
            <Button
              color="primary"
              variant="light"
              startContent={<Plus />}
              onPress={handleAddOption}
              isDisabled={
                ![
                  "single-select",
                  "multi-select",
                  "matching",
                  "output",
                ].includes(selectedType || "")
              }
            >
              Add Option
            </Button>
            <div className="flex gap-2">
              <Button color="danger" variant="light" onPress={handleClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSaveQuestion}
                isDisabled={!selectedType || !questionText}
              >
                {editingQuestion ? "Update Question" : "Save Question"}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuestionModal;
