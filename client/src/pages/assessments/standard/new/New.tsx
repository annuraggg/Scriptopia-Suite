import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DateValue,
  RangeValue,
  Tab,
  Tabs,
  TimeInputValue,
} from "@nextui-org/react";
import { useState } from "react";
import General from "./General";
import Questions from "./Questions";
import Grading from "./Grading";
import Candidates from "./Candidates";
import Instructions from "./Instructions";
import Security from "./Security";
import Feedback from "./Feedback";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  today,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import Languages from "./Languages";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";

const tabsList = [
  "General",
  "Languages",
  "Questions",
  "Grading",
  "Candidates",
  "Instructions",
  "Security",
  "Feedback",
];

interface Question {
  id: number;
  name: string;
  author: string;
  description: string;
  tags: string[];
}

const questions = [
  {
    id: 1,
    name: "Two Sum",
    author: "@kylelobo",
    description:
      "Given an array of integers, return indices of the two numbers such that they add up to a specific target. Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    tags: ["Array", "Dynamic Programming", "Binary Search", "Hash Table"],
  },
  {
    id: 2,
    name: "Longest Common Prefix",
    author: "@kylelobo",
    description:
      "Write a function to find the longest common prefix string amongst an array of strings.",
    tags: ["String", "Dynamic Programming", "Hash Table"],
  },
  {
    id: 3,
    name: "Longest Increasing Subsequence",
    author: "@kylelobo",
    description:
      "Given an unsorted array of integers, find the length of the longest increasing subsequence.",
    tags: ["Array", "Dynamic Programming", "Hash Table"],
  },
  {
    id: 4,
    name: "Longest Substring Without Repeating Characters",
    author: "@kylelobo",
    description:
      "Given a string, find the length of the longest substring without repeating characters.",
    tags: ["String", "Dynamic Programming", "Hash Table"],
  },
  {
    id: 5,
    name: "Valid Sudoku",
    author: "@kylelobo",
    description:
      "Determine if a 9x9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules: Each row must contain the digits 1-9 without repetition. Each column must contain the digits 1-9 without repetition. Each of the nine 3x3 sub-boxes of the grid must contain the digits 1-9 without repetition.",
    tags: ["Array", "Dynamic Programming", "Hash Table"],
  },
  {
    id: 6,
    name: "Valid Parentheses",
    author: "@kylelobo",
    description:
      "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    tags: ["String", "Dynamic Programming", "Hash Table"],
  },
];

const New = () => {
  const [activeTab, setActiveTab] = useState("0");

  // General Tab States
  const [assessmentName, setAssessmentName] = useState("");
  const [assessmentDescription, setAssessmentDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(0);
  const [passingPercentage, setPassingPercentage] = useState(0);
  const [testOpenRange, setTestOpenRange] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });
  const [startTime, setStartTime] = useState<TimeInputValue>(
    parseAbsoluteToLocal(new Date().toISOString())
  );
  const [endTime, setEndTime] = useState<TimeInputValue>(
    parseAbsoluteToLocal(new Date().toISOString())
  );

  // Languages Tab States
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Questions Tab States
  const [availableQuestions, setAvailableQuestions] =
    useState<Question[]>(questions);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  // Grading Tab States
  const [gradingMetric, setGradingMetric] = useState("testcase");
  const [testCaseGrading, setTestCaseGrading] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [questionsGrading, setQuestionsGrading] = useState<number[]>([]);

  // Candidates Tab States
  const [access, setAccess] = useState("all");
  const [candidates, setCandidates] = useState<
    { name: string; email: string }[]
  >([]);

  // Instructions Tab States
  const [instructions, setInstructions] = useState("");

  // Security Tab States
  const [codePlayback, setCodePlayback] = useState(false);
  const [codeExecution, setCodeExecution] = useState(false);
  const [tabChangeDetection, setTabChangeDetection] = useState(false);
  const [copyPasteDetection, setCopyPasteDetection] = useState(false);
  const [autocomplete, setAutocomplete] = useState(false);
  const [runCode, setRunCode] = useState(false);
  const [syntaxHighlighting, setSyntaxHighlighting] = useState(false);

  // Feedback Tab States
  const [feedbackEmail, setFeedbackEmail] = useState("");

  const { getToken } = useAuth();
  const buildAssessmentData = () => {
    const axios = ax(getToken);
    axios
      .post("/assessment", {
        assessmentName,
        assessmentDescription,
        timeLimit,
        passingPercentage,
        testOpenRange,
        startTime,
        endTime,
        selectedLanguages,
        selectedQuestions,
        testCaseGrading,
        questionsGrading,
        access,
        candidates,
        instructions,
        codePlayback,
        codeExecution,
        tabChangeDetection,
        copyPasteDetection,
        autocomplete,
        runCode,
        syntaxHighlighting,
        feedbackEmail,
      })
      .then(() => {
        toast.success("Assessment created successfully");
      })
      .catch(() => {
        toast.error("Error creating assessment");
      });
  };

  const handleSubmit = () => {};

  const tabsComponents = [
    <General
      {...{
        assessmentName,
        setAssessmentName,
        assessmentDescription,
        setAssessmentDescription,
        timeLimit,
        setTimeLimit,
        passingPercentage,
        setPassingPercentage,
        testOpenRange,
        setTestOpenRange,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
      }}
    />,
    <Languages {...{ selectedLanguages, setSelectedLanguages }} />,
    <Questions
      {...{
        availableQuestions,
        setAvailableQuestions,
        selectedQuestions,
        setSelectedQuestions,
        testCaseGrading,
        setTestCaseGrading,
      }}
    />,
    <Grading
      {...{
        gradingMetric,
        setGradingMetric,
        selectedQuestions,
        testCaseGrading,
        setTestCaseGrading,
        questionsGrading,
        setQuestionsGrading,
      }}
    />,
    <Candidates {...{ access, setAccess, candidates, setCandidates }} />,
    <Instructions {...{ instructions, setInstructions }} />,
    <Security
      {...{
        codePlayback,
        setCodePlayback,
        codeExecution,
        setCodeExecution,
        tabChangeDetection,
        setTabChangeDetection,
        copyPasteDetection,
        setCopyPasteDetection,
        autocomplete,
        setAutocomplete,
        runCode,
        setRunCode,
        syntaxHighlighting,
        setSyntaxHighlighting,
      }}
    />,
    <Feedback
      {...{
        feedbackEmail,
        setFeedbackEmail,
        handleSubmit,
        buildAssessmentData,
      }}
    />,
  ];

  return (
    <div className="flex items-center justify-center flex-col relative">
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(e) => setActiveTab(e as string)}
      >
        {tabsList.map((tabItem, i) => (
          <Tab key={i} title={tabItem} className="w-full">
            <Card className="w-full h-[80vh]">
              <CardHeader className="border-b flex items-center justify-between">
                <p>{tabItem}</p>
                <div className="flex gap-2">
                  <Button
                    variant="shadow"
                    size="sm"
                    isIconOnly
                    onClick={() =>
                      setActiveTab((parseInt(activeTab) - 1).toString())
                    }
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="shadow"
                    size="sm"
                    isIconOnly
                    onClick={() =>
                      setActiveTab((parseInt(activeTab) + 1).toString())
                    }
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="px-10 py-5">{tabsComponents[i]}</CardBody>
            </Card>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default New;
