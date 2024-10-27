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
import { Problem as ProblemAssessment } from "@shared-types/Assessment";
import { Key } from "react";
import { Delta } from "quill/core";

interface Problem extends VanillaProblem {
  description: Delta;
}

const tabsList = [
  "General",
  "Languages",
  "Problems",
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

  const buildAssessmentData = () => {
    const rangeStart = testOpenRange.start.toDate("UTC");
    const rangeEnd = testOpenRange.end.toDate("UTC");
    rangeStart.setHours(startTime.hour);
    rangeStart.setMinutes(startTime.minute);
    rangeEnd.setHours(endTime.hour);
    rangeEnd.setMinutes(endTime.minute);

    const step = window.history.state.usr.step;

    const reqBody = {
      assessmentpostingName: assessmentName,
      postingId: window.location.pathname.split("/")[2],
      step: step,
      isEnterprise: true,
      name: assessmentName,
      description: assessmentDescription,
      type: "code",
      timeLimit,
      passingPercentage,
      openRange: { start: rangeStart, end: rangeEnd },
      languages: selectedLanguages,
      problems: selectedQuestions.map((q) => q._id),
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
      .post("/postings/assessment", reqBody)
      .then(() => {
        toast.success("Assessment created successfully");
        window.location.href = window.location.pathname
          .split("/")
          .slice(0, -2)
          .join("/");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error creating assessment");
      });
  };

  const isTabValid = (tabIndex: number): boolean => {
    switch (tabIndex) {
      case 0: // General
        return (
          assessmentDescription.trim() !== "" &&
          timeLimit > 0 &&
          passingPercentage > 0 &&
          testOpenRange.start !== null &&
          testOpenRange.end !== null &&
          startTime !== null &&
          endTime !== null
        );
      case 1: // Languages
        return selectedLanguages.length > 0;
      case 2: // Problems
        return selectedQuestions.length > 0;
      case 3: // Grading
        if (gradingMetric === "testcase") {
          return (
            testCaseGrading.easy > 0 &&
            testCaseGrading.medium > 0 &&
            testCaseGrading.hard > 0
          );
        } else {
          return (
            questionsGrading.length === selectedQuestions.length &&
            questionsGrading.every((q) => q.points > 0)
          );
        }
      case 4: // Instructions
        return instructions.trim() !== "";
      case 5: // Security
        return true; // All fields are optional
      default:
        return true;
    }
  };

  const handleTabChange = (key: Key) => {
    const currentTabIndex = parseInt(activeTab);
    const newTabIndex = typeof key === "string" ? parseInt(key) : key;

    if (
      typeof newTabIndex === "number" &&
      newTabIndex > currentTabIndex &&
      !isTabValid(currentTabIndex)
    ) {
      toast.error("Please complete all required fields before proceeding.");
      return;
    }

    setActiveTab(newTabIndex.toString());
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
    <Instructions {...{ instructions, setInstructions, errors: {} }} />,
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
      <Tabs selectedKey={activeTab} onSelectionChange={handleTabChange}>
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
                      handleTabChange((parseInt(activeTab) - 1).toString())
                    }
                    isDisabled={parseInt(activeTab) === 0}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="shadow"
                    size="sm"
                    isIconOnly
                    onClick={() =>
                      handleTabChange((parseInt(activeTab) + 1).toString())
                    }
                    isDisabled={
                      parseInt(activeTab) === tabsList.length - 1 ||
                      !isTabValid(parseInt(activeTab))
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
