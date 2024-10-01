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
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { Mcq } from "@shared-types/Assessment";

const tabsList = ["General", "MCQs", "Instructions", "Security", "Feedback"];
const New = ({ assessmentName }: { assessmentName: string }) => {
  const [activeTab, setActiveTab] = useState("0");

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

  // MCQs Tab States
  const [mcqs, setMcqs] = useState<Mcq[]>([]);

  // Instructions Tab States
  const [instructions, setInstructions] = useState("");

  // Security Tab States
  const [codePlayback, setCodePlayback] = useState(false);
  const [tabChangeDetection, setTabChangeDetection] = useState(false);
  const [copyPasteDetection, setCopyPasteDetection] = useState(false);

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
    const step = window.history.state.usr.step;
    const reqBody = {
      assessmentPostingName: assessmentName,
      postingId: window.location.pathname.split("/")[2],
      name: assessmentName,
      isEnterprise: true,
      step: step,
      description: assessmentDescription,
      type: "mcq",
      timeLimit,
      passingPercentage,
      openRange: { start: rangeStart, end: rangeEnd },
      mcqs: mcqSchema,
      candidates: {
        type: "all",
      },
      instructions,
      security: {
        codePlayback,
        tabChangeDetection,
        copyPasteDetection,
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
    <Mcqs
      {...{
        mcqs,
        setMcqs,
      }}
    />,
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