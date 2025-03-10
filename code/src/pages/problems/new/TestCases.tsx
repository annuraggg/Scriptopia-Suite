import { motion } from "framer-motion";
import {
  Button,
  Divider,
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
} from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TestCase } from "@shared-types/Problem";
import { getInputs } from "@shared-functions/sdsl";
import {
  Table as ShadTable,
  TableHead as ShadTableHead,
  TableHeader as ShadTableHeader,
  TableRow as ShadTableRow,
} from "@/components/ui/table";
import Papa from "papaparse";
import { Alert } from "@/components/ui/alert";

interface Input {
  name: string;
  type: string;
  value: any;
}

const TestCases = ({
  testCases,
  setTestCases,
  sdsl,
}: {
  testCases: TestCase[];
  setTestCases: (
    testCases: TestCase[] | ((prev: TestCase[]) => TestCase[])
  ) => void;
  sdsl: string;
}) => {
  const {
    isOpen: isAddCaseOpen,
    onOpen: onAddCaseOpen,
    onOpenChange: onAddCaseOpenChange,
  } = useDisclosure();
  const {
    isOpen: isCSVOpen,
    onOpen: onCSVOpen,
    onOpenChange: onCSVOpenChange,
  } = useDisclosure();

  // Initialize input with the correct length based on fnArguments
  const [input, setInput] = useState<Input[]>([]);
  const [output, setOutput] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [isSample, setIsSample] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isEditingIndex, setIsEditingIndex] = useState<number>(-1);

  useEffect(() => {
    const inputs = getInputs(sdsl);
    if (inputs.error) {
      toast.error(inputs.error);
      return;
    }

    const inputMap = inputs.inputs.map((input) => ({
      name: input.name,
      type: input.type,
      value: null,
    }));

    setInput(inputMap);
  }, [sdsl]);

  // Function to handle input change
  const handleInputChange = (index: number, value: string) => {
    setInput((prev) => {
      const newInput = [...prev];
      newInput[index].value = value;
      return newInput;
    });
  };

  const addCase = () => {
    if (!input.every((i) => i.name !== ""))
      return toast.error("Please fill all the input fields");
    if (!output) return toast.error("Please fill the output field");
    if (difficulty === "") return toast.error("Please select a difficulty");

    const finalInput = [];
    for (let i = 0; i < input.length; i++) {
      if (input[i].value === "") {
        return toast.error(`Please fill the value of input ${i + 1}`);
      }
      finalInput.push(input[i].value);
    }

    const newTestCase: TestCase = {
      input: finalInput,
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
    const inputs = getInputs(sdsl);
    if (inputs.error) {
      toast.error(inputs.error);
      return;
    }

    const inputMap = inputs.inputs.map((input) => ({
      name: input.name,
      type: input.type,
      value: null,
    }));

    setInput(inputMap);
    setOutput("");
    setDifficulty("");
    setIsSample(false);
  };

  const editCase = (index: number) => {
    setIsEditing(true);
    setIsEditingIndex(index);
    const inputs = getInputs(sdsl);
    if (inputs.error) {
      toast.error(inputs.error);
      return;
    }

    const inputMap = inputs.inputs.map((input, i) => ({
      name: input.name,
      type: input.type,
      value: testCases[index].input[i],
    }));

    setInput(inputMap);

    setOutput(testCases[index].output);
    setDifficulty(testCases[index].difficulty);
    setIsSample(testCases[index].isSample);

    onAddCaseOpenChange();
  };

  const downloadSampleCSV = () => {
    // Create a sample CSV file
    const inputs = getInputs(sdsl);
    if (inputs.error) {
      toast.error(inputs.error);
      return;
    }

    const inputMap = inputs.inputs.map((input) => input.name);
    const columns = [...inputMap, "Output", "Difficulty", "Is Sample"];

    const finalCSV = [columns.join(",")];

    // Create a Blob with the CSV content
    const file = new Blob([finalCSV.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    // Create a temporary link element
    const link = document.createElement("a");
    const url = URL.createObjectURL(file);
    link.setAttribute("href", url);
    link.setAttribute("download", "sample.csv");

    // Append to body, trigger click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const importCSV = () => {
    const file = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (!file.files || file.files.length === 0) {
      toast.error("Please select a file to import");
      return;
    }

    const inputs = getInputs(sdsl);
    const csvFile = file.files[0];

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedTestCases: TestCase[] = [];
        let hasErrors = false;

        results.data.forEach((row: any, index: number) => {
          const inputValues = inputs.inputs.map((input) => {
            const value = row[input.name];
            let validatedValue = null;

            if (value === null || value === undefined) {
              toast.error(
                `Row ${index + 1}: Missing value for input "${input.name}"`
              );
              hasErrors = true;
              return null;
            }

            switch (input.type) {
              case "array":
                try {
                  const arr = JSON.parse(value);
                  if (!Array.isArray(arr)) throw new Error();
                  validatedValue = JSON.stringify(arr); // Keep array format
                } catch {
                  toast.error(
                    `Row ${index + 1}: Invalid array format for input "${
                      input.name
                    }"`
                  );
                  hasErrors = true;
                }
                break;

              case "char":
                if (value.length !== 1) {
                  toast.error(
                    `Row ${index + 1}: Invalid character for input "${
                      input.name
                    }" (must be a single character)`
                  );
                  hasErrors = true;
                } else {
                  validatedValue = value; // No additional quotes needed
                }
                break;

              case "float":
              case "double":
                const floatVal = parseFloat(value);
                if (isNaN(floatVal)) {
                  toast.error(
                    `Row ${index + 1}: Invalid float/double value for input "${
                      input.name
                    }"`
                  );
                  hasErrors = true;
                } else {
                  validatedValue = String(floatVal); // Convert to string without extra quotes
                }
                break;

              case "integer":
              case "long":
                const intVal = parseInt(value, 10);
                if (isNaN(intVal)) {
                  toast.error(
                    `Row ${index + 1}: Invalid integer/long value for input "${
                      input.name
                    }"`
                  );
                  hasErrors = true;
                } else {
                  validatedValue = String(intVal); // Convert to string without extra quotes
                }
                break;

              case "map":
                try {
                  const map = JSON.parse(value);
                  if (typeof map !== "object" || Array.isArray(map))
                    throw new Error();
                  validatedValue = JSON.stringify(map); // Keep object format
                } catch {
                  toast.error(
                    `Row ${index + 1}: Invalid map format for input "${
                      input.name
                    }"`
                  );
                  hasErrors = true;
                }
                break;

              case "set":
                try {
                  const set = JSON.parse(value);
                  if (!Array.isArray(set)) throw new Error();
                  validatedValue = JSON.stringify(Array.from(new Set(set))); // Convert set to string
                } catch {
                  toast.error(
                    `Row ${index + 1}: Invalid set format for input "${
                      input.name
                    }"`
                  );
                  hasErrors = true;
                }
                break;

              case "string":
                validatedValue = value; // No additional quotes needed for strings
                break;

              default:
                toast.error(
                  `Row ${index + 1}: Unknown type "${input.type}" for input "${
                    input.name
                  }"`
                );
                hasErrors = true;
            }

            return validatedValue;
          });

          const output = row["output"];
          if (output === null || output === undefined) {
            toast.error(`Row ${index + 1}: Missing output value`);
            hasErrors = true;
          }
          const validatedOutput =
            typeof output === "object" ? JSON.stringify(output) : output;

          const difficulty = row["difficulty"]?.toLowerCase();
          if (!["easy", "medium", "hard"].includes(difficulty)) {
            console.log(difficulty);
            toast.error(
              `Row ${
                index + 1
              }: Invalid difficulty value (must be easy, medium, or hard)`
            );
            hasErrors = true;
          }

          const isSampleStr = row["isSample"];
          const isSample = isSampleStr?.toLowerCase() === "true";
          if (
            isSampleStr &&
            isSampleStr.toLowerCase() !== "true" &&
            isSampleStr.toLowerCase() !== "false"
          ) {
            toast.error(
              `Row ${
                index + 1
              }: Invalid value for "Is Sample" (must be true or false)`
            );
            hasErrors = true;
          }

          if (!hasErrors) {
            parsedTestCases.push({
              input: inputValues,
              output: validatedOutput,
              difficulty: difficulty as "easy" | "medium" | "hard",
              isSample,
            });
          }
        });

        if (!hasErrors) {
          setTestCases(() => [...parsedTestCases]);
          onCSVOpenChange();
          toast.success("Test cases imported successfully!");
        } else {
          toast.error("Some rows had errors and were not imported.");
        }
      },
      error: (error) => {
        toast.error("Failed to parse CSV file: " + error.message);
      },
    });
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
          <Button
            color="secondary"
            aria-label="Import test cases from CSV"
            onClick={onCSVOpen}
          >
            Import from CSV
          </Button>
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
              {input.map((_, index) => (
                <Input
                  key={index}
                  label={`Input ${index + 1} (${input[index].name}) - ${
                    input[index].type
                  }`}
                  name={`input-${index}`}
                  size="sm"
                  value={input[index].value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  aria-label={`Input ${index + 1}`}
                />
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
                  <SelectItem key="easy">Easy</SelectItem>
                  <SelectItem key="medium">Medium</SelectItem>
                  <SelectItem key="hard">Hard</SelectItem>
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
              <Button variant="flat" color="success" onClick={() => addCase()}>
                Add Case
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isCSVOpen} onOpenChange={onCSVOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Import Test Cases
                </ModalHeader>
                <ModalBody>
                  <Alert className="bg-warning-100 text-warning-500">
                    <p>This will replace all the existing test cases.</p>
                  </Alert>

                  <p className=" text-sm">
                    Click{" "}
                    <a
                      href=""
                      onClick={downloadSampleCSV}
                      className="underline text-primary-500"
                    >
                      here{" "}
                    </a>
                    to download the sample CSV format.
                  </p>
                  <p className=" text-sm">
                    Import test cases from a CSV file. The CSV file should have
                    the following format:
                  </p>
                  <ShadTable>
                    <ShadTableHeader>
                      <ShadTableRow>
                        {input.map((_, index) => (
                          <ShadTableHead key={index}>
                            {input[index].name}
                          </ShadTableHead>
                        ))}
                        <ShadTableHead>Output</ShadTableHead>
                        <ShadTableHead>Difficulty</ShadTableHead>
                        <ShadTableHead>Is Sample</ShadTableHead>
                      </ShadTableRow>
                    </ShadTableHeader>
                  </ShadTable>

                  <Divider className="my-2" />
                  <Input
                    label="Upload CSV"
                    type="file"
                    aria-label="Upload CSV"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onClick={importCSV}>
                    Import
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </motion.div>
  );
};

export default TestCases;
