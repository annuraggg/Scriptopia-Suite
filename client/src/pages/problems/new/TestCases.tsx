import { motion } from "framer-motion";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";
import { ITestCase } from "@/@types/Problem";

const TestCases = ({
  testCases,
  setTestCases,
  fnArguments,
}: {
  testCases: ITestCase[];
  setTestCases: (
    testCases: ITestCase[] | ((prev: ITestCase[]) => ITestCase[])
  ) => void;
  fnArguments: { name: string; type: string }[];
}) => {
  const {
    isOpen: isAddCaseOpen,
    onOpen: onAddCaseOpen,
    onOpenChange: onAddCaseOpenChange,
  } = useDisclosure();

  // Initialize input with the correct length based on fnArguments
  const [input, setInput] = useState<string[]>(
    Array(fnArguments.length).fill("")
  );
  const [output, setOutput] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [isSample, setIsSample] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEditingIndex, setIsEditingIndex] = useState<number>(-1);

  // Function to handle input change
  const handleInputChange = (index: number, value: string) => {
    setInput((prev) => {
      const newInput = [...prev];
      newInput[index] = value;
      return newInput;
    });
  };

  const addCase = () => {
    if (!input.every((i) => i !== ""))
      return toast.error("Please fill all the input fields");
    if (!output) return toast.error("Please fill the output field");
    if (difficulty === "") return toast.error("Please select a difficulty");
    const newTestCase: ITestCase = {
      input: input,
      output: output,
      difficulty: difficulty as "easy" | "medium" | "hard",
      isSample: isSample,
    };

    if (!isEditing) setTestCases((prev) => [...prev, newTestCase]);
    else
      setTestCases((prev) =>
        prev.map((_i, itemIndex) =>
          itemIndex === isEditingIndex ? newTestCase : _i
        )
      );

    setIsEditing(false);
    setIsEditingIndex(-1);
    onAddCaseOpenChange();

    // Reset input and output
    setInput(() => Array(fnArguments.length).fill(""));
    setOutput("");
    setDifficulty("");
    setIsSample(false);
  };

  const editCase = (index: number) => {
    setIsEditing(true);
    setIsEditingIndex(index);
    setInput(testCases[index].input);
    setOutput(testCases[index].output);
    setDifficulty(testCases[index].difficulty);
    setIsSample(testCases[index].isSample);

    onAddCaseOpenChange();
  };

  return (
    <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className=""
  >
    <div className="px-5 py-2">
      <div className="flex gap-5">
        <Button
          color="secondary"
          onClick={onAddCaseOpen}
          aria-label="Add a new test case"
        >
          Add Case
        </Button>
        {/*<Button color="secondary" aria-label="Import test cases from CSV">Import from CSV</Button>*/}
      </div>
      <p className="mt-5">At least 5 cases are required</p>
      <Table className="mt-5" removeWrapper aria-label="Test cases">
        <TableHeader>
          <TableColumn>Case No.</TableColumn>
          <TableColumn>Input</TableColumn>
          <TableColumn>Output</TableColumn>
          <TableColumn>Difficulty</TableColumn>
          <TableColumn>Is Sample</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {testCases.map((testCase, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{testCase.input.join(", ")}</TableCell>
              <TableCell>{testCase.output}</TableCell>
              <TableCell>{testCase.difficulty}</TableCell>
              <TableCell>{testCase.isSample ? "Yes" : "No"}</TableCell>
              <TableCell className="w-56 ">
                <Button
                  variant="light"
                  color="warning"
                  onClick={() => {
                    setIsEditing(true);
                    setIsEditingIndex(index);
                    editCase(index);
                  }}
                  aria-label="Edit this case"
                >
                  Edit
                </Button>
                <Button
                  variant="light"
                  color="danger"
                  className="ml-5"
                  onClick={() => {
                    setTestCases((prev) =>
                      prev.filter((_i, itemIndex) => itemIndex !== index)
                    );
                  }}
                  aria-label="Delete this case"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={isAddCaseOpen}
        onOpenChange={onAddCaseOpenChange}
        backdrop="blur"
        aria-labelledby="modal-title"
      >
        <ModalContent>
          <ModalHeader id="modal-title">Add Case</ModalHeader>
          <ModalBody>
            <p>Input Arguments</p>
            {fnArguments.map((arg, index) => (
              <div key={index} className="flex gap-10 items-center">
                <Input
                  name="input"
                  label={arg.name + " (" + arg.type + ")"}
                  size="sm"
                  value={input[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  aria-label={`Input for ${arg.name}`}
                />
              </div>
            ))}

            <p>Output</p>
            <Textarea
              label="Output"
              name="output"
              size="sm"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              aria-label="Output"
            />

            <div className="flex gap-5 items-center">
              <Select
                label="Difficulty"
                name="difficulty"
                size="sm"
                selectedKeys={[difficulty]}
                onChange={(e) => setDifficulty(e.target.value)}
                aria-label="Select difficulty"
              >
                <SelectItem key="easy" value="Easy">
                  Easy
                </SelectItem>
                <SelectItem key="medium" value="Medium">
                  Medium
                </SelectItem>
                <SelectItem key="hard" value="Hard">
                  Hard
                </SelectItem>
              </Select>
              <Switch
                className="w-full"
                size="sm"
                isSelected={isSample}
                onChange={() => setIsSample((prev) => !prev)}
                name="isSample"
                aria-label="Is sample"
              >
                Is Sample
              </Switch>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onClick={onAddCaseOpenChange}>
              Cancel
            </Button>
            <Button
              variant="flat"
              color="success"
              onClick={() => addCase()}
            >
              Add Case
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
    </motion.div>
  );
};

export default TestCases;
