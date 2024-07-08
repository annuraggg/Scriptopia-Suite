import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Input, Select, SelectItem, Button } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { useState } from "react";
import { motion } from "framer-motion";

const McqModal = ({
  isOpen,
  onOpenChange,
  save,
  title,
  setTitle,
  questionType,
  setQuestionType,
  newOption,
  setNewOption,
  options,
  setOptions,
  correctOption,
  setCorrectOption,
  newCheckbox,
  setNewCheckbox,
  checkboxes,
  setCheckboxes,
  correctCheckboxes,
  setCorrectCheckboxes,
}: {
  isOpen: boolean;
  onOpenChange: any;
  save: (
    question: string,
    type: "multiple" | "checkbox" | "text",
    mcq: { options: string[]; correct: string },
    checkbox: { options: string[]; correct: string[] }
  ) => void;
  isEditing: boolean;
  title: string;
  setTitle: (title: string) => void;
  questionType: Set<string>;
  setQuestionType: (type: Set<string>) => void;
  newOption: string;
  setNewOption: (option: string) => void;
  options: string[];
  setOptions: (options: string[]) => void;
  correctOption: string;
  setCorrectOption: (option: string) => void;
  newCheckbox: string;
  setNewCheckbox: (option: string) => void;
  checkboxes: string[];
  setCheckboxes: (options: string[]) => void;
  correctCheckboxes: string[];
  setCorrectCheckboxes: (options: string[]) => void;
}) => {
  const [error, setError] = useState<string>("");

  const addOption = () => {
    if (newOption === "") return;
    if (options.includes(newOption)) return;

    setOptions([...options, newOption]);
    setNewOption("");
  };

  const addCheckbox = () => {
    if (newCheckbox === "") return;
    if (checkboxes.includes(newCheckbox)) return;

    setCheckboxes([...checkboxes, newCheckbox]);
    setNewCheckbox("");
  };

  const saveData = () => {
    if (title.trim() === "") {
      setError("Question title is required.");
      return;
    }

    const type = Array.from(questionType)[0];

    if (!type) {
      setError("Question type is required.");
      return;
    }

    if (type === "multiple") {
      if (options.length === 0) {
        setError("At least one option is required for multiple choice.");
        return;
      }
      if (correctOption.trim() === "") {
        setError("A correct option must be selected for multiple choice.");
        return;
      }
    }

    if (type === "checkbox") {
      if (checkboxes.length === 0) {
        setError("At least one option is required for checkbox.");
        return;
      }
      if (correctCheckboxes.length === 0) {
        setError("At least one correct checkbox must be selected.");
        return;
      }
    }

    const question = title;
    const mcq = {
      options,
      correct: correctOption,
    };
    const checkbox = {
      options: checkboxes,
      correct: correctCheckboxes,
    };

    // @ts-expect-error - Types Not Available
    save(question, type, mcq, checkbox);

    setTitle("");
    setQuestionType(new Set<string>(["multiple"]));
    setOptions([]);
    setCorrectOption("");
    setCheckboxes([]);
    setCorrectCheckboxes([]);
    setError("");
  };

  return (
    <div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex gap-10 pb-10"
      >
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          backdrop="blur"
          className="min-w-[50vw]"
        >
          <ModalContent>
            <ModalHeader>Add MCQ</ModalHeader>
            <ModalBody>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <div className="flex gap-2">
                <Input
                  placeholder="Question Title"
                  className="min-w-[70%]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Select
                  selectedKeys={questionType}
                  onSelectionChange={(value) =>
                    setQuestionType(
                      new Set<string>(Array.from(value) as string[])
                    )
                  }
                >
                  <SelectItem key="multiple" value="multiple">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem key="checkbox" value="checkbox">
                    Checkbox
                  </SelectItem>
                  <SelectItem key="text" value="text">
                    Text
                  </SelectItem>
                </Select>
              </div>

              {questionType.has("multiple") && (
                <div className="">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Option Name"
                      className="min-w-[70%]"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                    />
                    <Button onClick={addOption}>Add Option</Button>
                  </div>
                  <RadioGroup
                    value={correctOption}
                    className="mt-5"
                    onValueChange={setCorrectOption}
                  >
                    {options.map((option, i) => (
                      <Radio key={i} value={option}>
                        {option}
                      </Radio>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {questionType.has("checkbox") && (
                <div className="">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Option Name"
                      className="min-w-[70%]"
                      value={newCheckbox}
                      onChange={(e) => setNewCheckbox(e.target.value)}
                    />
                    <Button onClick={addCheckbox}>Add Option</Button>
                  </div>
                  <CheckboxGroup
                    value={correctCheckboxes}
                    onValueChange={setCorrectCheckboxes}
                    className=" mt-5"
                  >
                    {checkboxes.map((option, i) => (
                      <Checkbox key={i} value={option}>
                        {option}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={saveData}>Save</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </motion.div>
    </div>
  );
};

export default McqModal;
