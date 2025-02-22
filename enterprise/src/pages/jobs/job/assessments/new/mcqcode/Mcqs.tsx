import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import McqModal from "./McqModal";
import { Mcq } from "@shared-types/Assessment";
import { useState, useRef } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashIcon,
  ImportIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const Mcqs = ({
  mcqs,
  setMcqs,
}: {
  mcqs: Mcq[];
  setMcqs: (mcqs: Mcq[] | ((prev: Mcq[]) => Mcq[])) => void;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [questionType, setQuestionType] = useState(
    new Set<string>(["multiple"])
  );

  // MC States
  const [newOption, setNewOption] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [correctOption, setCorrectOption] = useState<string>("");
  const [grade, setGrade] = useState<number>(1);

  // Checkbox States
  const [newCheckbox, setNewCheckbox] = useState<string>("");
  const [checkboxes, setCheckboxes] = useState<string[]>([]);
  const [correctCheckboxes, setCorrectCheckboxes] = useState<string[]>([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const addMcq = (
    question: string,
    type: "multiple" | "checkbox" | "text",
    mcq: { options: string[]; correct: string },
    checkbox: { options: string[]; correct: string[] },
    grade: number
  ) => {
    if (isEditing) {
      const newMcqs = [...mcqs];
      newMcqs[editingIndex!] = { question, type, mcq, checkbox, grade };
      setMcqs(newMcqs);
      if (isOpen) onOpenChange();
      resetModalState();
      return;
    }

    setMcqs([...mcqs, { question, type, mcq, checkbox, grade }]);

    resetModalState();
    if (isOpen) onOpenChange();
  };

  const resetModalState = () => {
    setTitle("");
    setQuestionType(new Set<string>(["multiple"]));
    setOptions([]);
    setCorrectOption("");
    setCheckboxes([]);
    setCorrectCheckboxes([]);
    setNewOption("");
    setNewCheckbox("");
    setGrade(1);
    setEditingIndex(null);
    setIsEditing(false);
  };

  const handleOpen = () => {
    resetModalState();
    onOpen();
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const newQuestions = [...mcqs];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newQuestions.length) {
      const temp = newQuestions[targetIndex];
      newQuestions[targetIndex] = newQuestions[index];
      newQuestions[index] = temp;
      setMcqs(newQuestions);
    }
  };

  const editQuestion = (editingIndex: number) => {
    setEditingIndex(editingIndex);
    setIsEditing(true);
    setTitle(mcqs[editingIndex!].question);
    setQuestionType(new Set<string>([mcqs[editingIndex!].type]));
    setOptions(mcqs[editingIndex!]?.mcq?.options ?? []);
    setCorrectOption(mcqs[editingIndex!]?.mcq?.correct ?? "");
    setCheckboxes(mcqs[editingIndex!]?.checkbox?.options ?? []);
    setCorrectCheckboxes(mcqs[editingIndex!]?.checkbox?.correct ?? []);
    setGrade(mcqs[editingIndex!].grade);
    onOpen();
  };

  const handleImportCSV = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processCSV = (csv: string) => {
    const lines = csv.split("\n");
    const newMcqs: Mcq[] = [];

    lines.forEach((line, index) => {
      if (index === 0) return; // Skip header row
      const [question, type, options, correct, gradeStr] = line.split(",");

      const mcqOptions = options.split(";");
      const grade = parseInt(gradeStr, 10) || 1;

      if (type === "multiple") {
        newMcqs.push({
          question,
          type: "multiple",
          mcq: { options: mcqOptions, correct },
          checkbox: { options: [], correct: [] },
          grade,
        });
      } else if (type === "checkbox") {
        const correctOptions = correct.split(";");
        newMcqs.push({
          question,
          type: "checkbox",
          mcq: { options: [], correct: "" },
          checkbox: { options: mcqOptions, correct: correctOptions },
          grade,
        });
      }
    });

    setMcqs((prevMcqs) => [...prevMcqs, ...newMcqs]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        processCSV(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <div className="flex flex-row justify-start gap-2">
          <Button onClick={handleOpen}>Add Question</Button>
          <Button variant="ghost" onClick={handleImportCSV}>
            <ImportIcon size={22} />
            Import CSV
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            style={{ display: "none" }}
          />
        </div>
        <McqModal
          isOpen={isOpen}
          onOpenChange={(open: boolean) => {
            if (!open) {
              resetModalState();
            }
            onOpenChange();
          }}
          save={addMcq}
          isEditing={isEditing}
          title={title}
          setTitle={setTitle}
          questionType={questionType}
          setQuestionType={setQuestionType}
          newOption={newOption}
          setNewOption={setNewOption}
          options={options}
          setOptions={setOptions}
          correctOption={correctOption}
          setCorrectOption={setCorrectOption}
          newCheckbox={newCheckbox}
          setNewCheckbox={setNewCheckbox}
          checkboxes={checkboxes}
          setCheckboxes={setCheckboxes}
          correctCheckboxes={correctCheckboxes}
          setCorrectCheckboxes={setCorrectCheckboxes}
          grade={grade}
          setGrade={setGrade}
        />

        <div>
          {mcqs.map((mcq, i) => (
            <div
              key={i}
              className="flex mb-5 gap-2 border p-5 rounded-xl w-full justify-between"
            >
              <div>
                <h4>
                  {i + 1}. {mcq.question}
                </h4>
                <p className="text-xs">
                  {mcq.type === "multiple" && "Multiple Choice"}
                  {mcq.type === "checkbox" && "Checkbox"}
                </p>
              </div>

              <div>
                <div className="flex gap-2">
                  <Button isIconOnly onClick={() => moveQuestion(i, "up")}>
                    <ChevronUpIcon />
                  </Button>
                  <Button isIconOnly onClick={() => moveQuestion(i, "down")}>
                    <ChevronDownIcon />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="mt-2"
                    color="danger"
                    variant="flat"
                    onClick={() => {
                      setMcqs((prev) => prev.filter((q) => q !== mcq));
                    }}
                    isIconOnly
                  >
                    <TrashIcon />
                  </Button>
                  <Button
                    className="mt-2"
                    color="warning"
                    variant="flat"
                    onClick={() => editQuestion(i)}
                    isIconOnly
                  >
                    <PencilIcon />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Mcqs;
