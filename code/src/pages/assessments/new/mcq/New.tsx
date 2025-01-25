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
import { useState, Key } from "react";
import General from "./General";
import Instructions from "./Instructions";
import Security from "./Security";
import Feedback from "./Feedback";
import Mcqs from "../mcq/createmcq/Mcqs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  today,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { Section, Question, Candidate } from "@shared-types/MCQAssessment";
import Candidates from "./Candidates";

export interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (question: Question) => void;
  editingQuestion: Question | null;
}

export interface McqContentProps {
  selectedSection: Section | null;
}

export interface McqProps {
  sections: Section[];
  setSections: (sections: Section[]) => void;
  selectedSection: Section | null;
  setSelectedSection: (section: Section | null) => void;
}

const tabsList = ["General", "MCQs", "Candidates", "Instructions", "Security", "Feedback"];
const New = () => {
  const [activeTab, setActiveTab] = useState("0");

  const [assessmentName, setAssessmentName] = useState("");
  const [assessmentDescription, setAssessmentDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(0);
  const [passingPercentage, setPassingPercentage] = useState(0);

  const [testOpenRange, setTestOpenRange] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });
  const [focusedValue, setFocusedValue] = useState(today(getLocalTimeZone()));

  const [startTime, setStartTime] = useState<TimeInputValue>(
    parseAbsoluteToLocal(new Date().toISOString())
  );
  const [endTime, setEndTime] = useState<TimeInputValue>(
    parseAbsoluteToLocal(new Date().toISOString())
  );

  const [sections, setSections] = useState<Section[]>([]);

  const [selectedSectionIndex, setSelectedSectionIndex] = useState<
    number | null
  >(null);

  const [access, setAccess] = useState("all");
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [instructions, setInstructions] = useState("");

  // Security Tab States
  const [codePlayback, setCodePlayback] = useState(false);
  const [tabChangeDetection, setTabChangeDetection] = useState(false);
  const [copyPasteDetection, setCopyPasteDetection] = useState(false);

  const [feedbackEmail, setFeedbackEmail] = useState("");

  const handleTabChange = (key: Key) => {
    setActiveTab(key.toString());
  };

  const { getToken } = useAuth();

  const buildAssessmentData = () => {
    const rangeStart = testOpenRange.start.toDate("UTC");
    const rangeEnd = testOpenRange.end.toDate("UTC");
    rangeStart.setHours(startTime.hour);
    rangeStart.setMinutes(startTime.minute);
    rangeEnd.setHours(endTime.hour);
    rangeEnd.setMinutes(endTime.minute);

    const reqBody = {
      assessmentPostingName: assessmentName,
      name: assessmentName,
      isEnterprise: false,
      description: assessmentDescription,
      timeLimit,
      passingPercentage,
      openRange: {
        start: rangeStart,
        end: rangeEnd,
      },
      sections: sections,
      candidates: candidates,
      public: access === "all",
      instructions,
      security: {
        codePlayback,
        tabChangeDetection,
        copyPasteDetection,
      },
      feedbackEmail,
    };

    console.log(reqBody);

    const axios = ax(getToken);
    axios
      .post("/assessments/mcq", reqBody)
      .then(() => {
        toast.success("Assessment created successfully");
        // window.location.href = window.location.pathname
        //   .split("/")
        //   .slice(0, -2)
        //   .join("/");
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
        focusedValue,
        setFocusedValue,
      }}
    />,
    <Mcqs
      sections={sections}
      setSections={setSections}
      selectedSectionIndex={selectedSectionIndex}
      setSelectedSectionIndex={setSelectedSectionIndex}
    />,
    <Candidates {...{ access, setAccess, candidates, setCandidates }} />,
    <Instructions {...{ instructions, setInstructions }} />,
    <Security
      {...{
        codePlayback,
        setCodePlayback,
        tabChangeDetection,
        setTabChangeDetection,
        copyPasteDetection,
        setCopyPasteDetection,
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
                    isDisabled={parseInt(activeTab) === tabsList.length - 1}
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
