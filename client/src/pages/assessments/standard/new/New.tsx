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

const tabsList = [
  "General",
  "Questions",
  "Grading",
  "Candidates",
  "Instructions",
  "Security",
  "Feedback",
];

const New = () => {
  const [activeTab, setActiveTab] = useState("0");

  // General Tab States
  const [assessmentName, setAssessmentName] = useState("");
  const [assessmentDescription, setAssessmentDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(0);
  const [passingPercentage, setPassingPercentage] = useState(0);
  const [allowAutocomplete, setAllowAutocomplete] = useState(false);
  const [allowRunCode, setAllowRunCode] = useState(false);
  const [allowSyntaxHighlighting, setAllowSyntaxHighlighting] = useState(false);
  const [testOpenRange, setTestOpenRange] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });
  const [startTime, setStartTime] = useState<TimeInputValue>(
    parseAbsoluteToLocal(Date.now().toLocaleString())
  );
  const [endTime, setEndTime] = useState<TimeInputValue>(
    parseAbsoluteToLocal(Date.now().toLocaleString())
  );

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
        allowAutocomplete,
        setAllowAutocomplete,
        allowRunCode,
        setAllowRunCode,
        allowSyntaxHighlighting,
        setAllowSyntaxHighlighting,
        testOpenRange,
        setTestOpenRange,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
      }}
    />,
    <Questions />,
    <Grading />,
    <Candidates />,
    <Instructions />,
    <Security />,
    <Feedback />,
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
