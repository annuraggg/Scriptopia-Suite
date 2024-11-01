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
import { useEffect, useState } from "react";
import General from "./General";
import Questions from "./Questions";
import Grading from "./Grading";
import Instructions from "./Instructions";
import Security from "./Security";
import Feedback from "./Feedback";
import Mcqs from "./Mcqs";
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
import { Problem as VanillaProblem } from "@shared-types/Problem";
import { Mcq, Problem as ProblemAssessment } from "@shared-types/Assessment";
import { Delta } from "quill/core";

interface Problem extends VanillaProblem {
  _id: string;
  description: Delta;
}

const tabsList = [
  "General",
  "Languages",
  "Problems",
  "MCQs",
  "Grading",
  "Instructions",
  "Security",
  "Feedback",
];
const New = ({ assessmentName }: { assessmentName: string }) => {
  const [activeTab, setActiveTab] = useState("0");

  // General Tab States
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

  const [selectedQuestions, setSelectedQuestions] = useState<Problem[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Problem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const axios = ax(getToken);
    axios
      .get("/problems/all/1")
      .then((data) => {
        setAvailableQuestions(data.data.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  // Grading Tab States
  const [gradingMetric, setGradingMetric] = useState("testcase");
  const [testCaseGrading, setTestCaseGrading] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [questionsGrading, setQuestionsGrading] = useState<ProblemAssessment[]>(
    []
  );

  // MCQs Tab States
  const [mcqs, setMcqs] = useState<Mcq[]>([]);

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
    const rangeStart = testOpenRange.start.toDate("UTC");
    const rangeEnd = testOpenRange.end.toDate("UTC");
    rangeStart.setHours(startTime.hour);
    rangeStart.setMinutes(startTime.minute);
    rangeEnd.setHours(endTime.hour);
    rangeEnd.setMinutes(endTime.minute);

    const mcqSchema = mcqs.map((mcq: Mcq) => ({
      question: mcq.question,
      type: mcq.type,
      mcq: mcq.type === "multiple" ? mcq.mcq : undefined,
      checkbox: mcq.type === "checkbox" ? mcq.checkbox : undefined,
      grade: mcq.grade,
    }));

    const reqBody = {
      assessmentDriveName: assessmentName,
      driveId: window.location.pathname.split("/")[3],
      name: assessmentName,
      description: assessmentDescription,
      type: "mcqcode",
      timeLimit,
      passingPercentage,
      openRange: { start: rangeStart, end: rangeEnd },
      languages: selectedLanguages,
      problems: selectedQuestions.map((q) => q._id),
      mcqs: mcqSchema,
      grading:
        gradingMetric === "testcase"
          ? { type: "testcase", testcases: testCaseGrading }
          : { type: "problem", problem: questionsGrading },
      candidates: {
        type: "all",
      },
      instructions,
      security: {
        codePlayback,
        codeExecution,
        tabChangeDetection,
        copyPasteDetection,
        allowAutocomplete: autocomplete,
        allowRunningCode: runCode,
        enableSyntaxHighlighting: syntaxHighlighting,
      },
      feedbackEmail,
    };

    const axios = ax(getToken);
    axios
      .post("/drives/assessment", reqBody)
      .then(() => {
        toast.success("Assessment created successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error creating assessment");
      });
  };

  const tabsComponents = [
    <General
      {...{
        assessmentName,
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
        isLoading,
      }}
    />,
    <Mcqs
      {...{
        mcqs,
        setMcqs,
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
        buildAssessmentData,
      }}
    />,
  ];

  return (
    <div className="flex items-center justify-center flex-col relative w-full">
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
