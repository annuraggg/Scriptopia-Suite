import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  Button,
  Select,
  SelectItem,
  Input,
  Checkbox,
  RadioGroup,
  Radio,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Plus } from "lucide-react";
import MonacoEditor from "@monaco-editor/react";
import { Option, Question, QuestionType } from "@shared-types/MCQAssessment";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (question: Question) => void;
  editingQuestion: Question | null;
}

const QuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  onAddQuestion,
  editingQuestion,
}) => {
  const [grade, setGrade] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [code, setCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [maxLimit, setMaxLimit] = useState<number>(70);
  const [fillInBlanksAnswers, setFillInBlanksAnswers] = useState<string[]>([]);
  const [selectedCorrectOption, setSelectedCorrectOption] =
    useState<string>("");

  useEffect(() => {
    if (editingQuestion) {
      setSelectedType(editingQuestion.type);
      setQuestionText(editingQuestion.question);
      setOptions(editingQuestion.options || []);
      setCode(editingQuestion.codeSnippet || "");
      setImageUrl(editingQuestion.imageSource || "");
      setMaxLimit(editingQuestion.maxCharactersAllowed || 70);
      setFillInBlanksAnswers([]);
      console.log("FIB", editingQuestion.fillInBlankAnswers);
      setFillInBlanksAnswers(editingQuestion.fillInBlankAnswers || []);
      setSelectedCorrectOption(editingQuestion.correct || "");
      setBlankAnswers(editingQuestion.fillInBlankAnswers || []);
      setGrade(editingQuestion?.grade || 0);

      const correctOption = editingQuestion.options?.find(
        (opt) => opt.isCorrect
      );
      if (correctOption) {
        setSelectedCorrectOption(correctOption.option);
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
    setSelectedCorrectOption("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddOption = () => {
    const newOption: Option = {
      option: "",
      isCorrect: false,
      matchingPairText: selectedType === "matching" ? "" : undefined,
    };
    setOptions([...options, newOption]);
  };

  const handleOptionChange = (
    id: number,
    field: "option" | "matchingPairText" | "isCorrect",
    value: string | boolean
  ) => {
    setOptions(
      options.map((opt, index) =>
        index === id ? { ...opt, [field]: value } : opt
      )
    );
  };

  const handleRadioChange = (value: string) => {
    setSelectedCorrectOption(value);
    setOptions(
      options.map((opt) => ({
        ...opt,
        isCorrect: opt.option === value,
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

  const handleSaveQuestion = () => {
    if (!selectedType) return;
    if (!questionText) return;

    const newQuestion: Question = {
      question: questionText,
      type: selectedType,
      grade: grade,
      codeSnippet: code || undefined,
    };

    switch (selectedType) {
      case "single-select":
      case "multi-select":
      case "matching":
      case "output":
        newQuestion.options = options;
        break;
      case "true-false":
        newQuestion.options = options;
        break;
      case "short-answer":
        newQuestion.correct = selectedCorrectOption;
        newQuestion.maxCharactersAllowed = maxLimit;
        break;
      case "long-answer":
        newQuestion.maxCharactersAllowed = maxLimit;
        break;
      case "visual":
        newQuestion.correct = selectedCorrectOption;
        newQuestion.imageSource = imageUrl;
        break;
      case "fill-in-blanks":
        newQuestion.fillInBlankAnswers = fillInBlanksAnswers;
        break;
    }

    onAddQuestion(newQuestion);
    handleClose();
  };

  // First, let's add an input array for the answers
  const [blankAnswers, setBlankAnswers] = useState<string[]>([]);

  const renderQuestionContent = () => {
    switch (selectedType) {
      case "single-select":
        return (
          <div className="space-y-4">
            <RadioGroup
              value={
                selectedCorrectOption === "" ? undefined : selectedCorrectOption
              }
              onValueChange={handleRadioChange}
              label="Select correct answer"
            >
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    className="flex-1"
                    label={`Option ${index + 1}`}
                    value={option.option}
                    onChange={(e) =>
                      handleOptionChange(index, "option", e.target.value)
                    }
                  />
                  <Radio value={option.option}>Correct</Radio>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "multi-select":
        return (
          <div className="space-y-4">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  label={`Option ${index + 1}`}
                  value={option.option}
                  onChange={(e) =>
                    handleOptionChange(index, "option", e.target.value)
                  }
                />
                <Checkbox
                  isSelected={option.isCorrect}
                  onValueChange={(checked) =>
                    handleOptionChange(index, "isCorrect", checked)
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
          <RadioGroup
            value={selectedCorrectOption}
            onValueChange={handleRadioChange}
            label="Select correct answer"
          >
            <Radio value="True">True</Radio>
            <Radio value="False">False</Radio>
          </RadioGroup>
        );

      case "short-answer":
        return (
          <>
            <div className="text-sm font-medium">Enter the correct answer:</div>
            <Input
              label="Correct Answer"
              placeholder="Enter correct answer"
              value={selectedCorrectOption}
              onChange={(e) => setSelectedCorrectOption(e.target.value)}
              className="mt-4"
            />
            <Input
              type="number"
              label="Maximum Character Limit"
              value={maxLimit.toString()}
              onChange={(e) => setMaxLimit(Number(e.target.value))}
              className="mt-4"
            />
          </>
        );

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
          <div className="">
            <Input
              label="Correct Answer"
              placeholder="Enter correct answer"
              value={selectedCorrectOption}
              onChange={(e) => setSelectedCorrectOption(e.target.value)}
              className="mb-4"
            />
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
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  label={`Option ${index + 1}`}
                  value={option.option}
                  onChange={(e) =>
                    handleOptionChange(index, "option", e.target.value)
                  }
                />
                <Input
                  className="flex-1"
                  label={`Match ${index + 1}`}
                  value={option.matchingPairText}
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      "matchingPairText",
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
          </div>
        );

      // Update the fill in blanks section in renderQuestionContent()
      case "fill-in-blanks":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              {selectedType === "fill-in-blanks" &&
                questionText.split("___").length > 1 && (
                  <div className="text-sm font-medium">
                    Enter answers for each blank:
                  </div>
                )}
              {selectedType === "fill-in-blanks" &&
                Array(questionText.split("___").length - 1)
                  .fill(0)
                  .map((_, index) => (
                    <Input
                      key={index}
                      label={`Answer ${index + 1}`}
                      placeholder={`Enter answer for blank ${index + 1}`}
                      value={blankAnswers[index] || ""}
                      onChange={(e) => {
                        const newAnswers = [...blankAnswers];
                        newAnswers[index] = e.target.value;
                        setBlankAnswers(newAnswers);
                        setFillInBlanksAnswers(newAnswers);
                      }}
                    />
                  ))}
            </div>
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
          <div className="flex gap-3">
            <Select
              label="Question Type"
              placeholder="Select a question type"
              selectedKeys={selectedType ? [selectedType] : []}
              onChange={(e) => setSelectedType(e.target.value as QuestionType)}
              isDisabled={!!editingQuestion}
            >
              {[
                "single-select",
                "multi-select",
                "true-false",
                "short-answer",
                "long-answer",
                "visual",
                "output",
                "fill-in-blanks",
                "matching",
              ].map((type) => (
                <SelectItem key={type}>
                  {type
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Grade"
              placeholder="Enter grade"
              type="number"
              value={grade.toString()}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-1/4"
            />
          </div>

          {selectedType && (
            <Input
              label="Question Text"
              placeholder={`Enter your question ${
                selectedType === "fill-in-blanks" ? "use ___ for blanks" : ""
              }`}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className={`mt-4 `}
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
