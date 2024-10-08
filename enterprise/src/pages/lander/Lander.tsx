import { RootState } from "@/types/Reducer";
import { Button, Card, CardBody, Image, Switch } from "@nextui-org/react";
import {
  BriefcaseBusiness,
  FileText,
  Filter,
  Inbox,
  UserCheck,
  BarChart,
  Video,
  PieChart,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Lander = () => {
  const navigate = useNavigate();
  const organization = useSelector((state: RootState) => state.organization);
  const redirectUser = () => {
    if (organization._id) {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  };

  const features = [
    { icon: <BriefcaseBusiness size={30} />, title: "Jobs" },
    { icon: <UserCheck size={30} />, title: "Candidates" },
    { icon: <Filter size={30} />, title: "Assessments" },
    { icon: <Inbox size={30} />, title: "Applications" },
    { icon: <BarChart size={30} />, title: "Resume Screening" },
    { icon: <Video size={30} />, title: "Interviews" },
    { icon: <FileText size={30} />, title: "Assignments" },
    { icon: <PieChart size={30} />, title: "Analytics" },
  ];

  const steps = [
    {
      title: "Job Posting and Requisition Management",
      desc: "Effortlessly create and distribute job postings to multiple platforms.\n Track and manage job requisitions with ease.",
    },
    {
      title: "Application Collection",
      desc: "Collect applications from job boards, company websites, and direct submissions. \n Parse and store applicant information, resumes, and cover letters securely.",
    },
    {
      title: "Automated Resume Screening",
      desc: "Display a curated list of selected candidates for your review. \n Easily manage and track candidate progress.",
    },
    {
      title: "Assessments",
      desc: "Create tailored assessments including multiple-choice questions and coding challenges.\n Evaluate candidates' skills directly on our platform.",
    },
    {
      title: "Conduct interviews.",
      desc: "Schedule interviews, communicate with candidates, and gather feedback seamlessly.",
    },
  ];

  const [withoutScriptopia, setWithoutScriptopia] = useState(false);
  return (
    <div className="py-10 mx-20">
      <div>
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
      </div>

      <div className="flex max-w-[100vw] h-[95vh] items-center">
        <div className="flex flex-col h-full mt-48">
          <h1 className="text-7xl max-w-[50vw] pr-48 font-poly leading-tight drop-shadow-glow">
            Industry Grade Screening and Hiring Platform.
          </h1>
          <div className="flex flex-row gap-5  w-[30vw] mt-10">
            <Button
              className="w-full"
              color="success"
              variant="shadow"
              onClick={() => redirectUser()}
            >
              Get Started
            </Button>
          </div>
        </div>
        <div className="relative max-w-[50vw] h-full">
          <div className="absolute top-0 left-0 transition-all duration-300 ease-in-out hover:z-10">
            <Image
              src="/lander2.png"
              alt="Hiring"
              className="border min-w-[40vw] min-h-[100%] drop-shadow-glow-dark"
            />
          </div>
          <div className="absolute top-10 -left-10 transition-all duration-300 ease-in-out z-0 hover:z-0">
            <Image
              src="/lander1.png"
              alt="Hiring"
              className="border min-w-[40vw] min-h-[100%] drop-shadow-glow-dark"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-20 flex-col gap-5">
        <h2 className="font-caveat text-7xl">
          All your talent aquisition needs in one place
        </h2>
      </div>
      <div className="flex items-center justify-center mt-10 gap-5">
        <p className=" font-caveat text-2xl">Without Scriptopia</p>
        <Switch
          defaultSelected
          aria-label="Without Scriptopia"
          color="danger"
          onChange={() => setWithoutScriptopia(!withoutScriptopia)}
          isSelected={withoutScriptopia}
        />
      </div>

      <div
        className={`flex items-center justify-center h-[72vh] transition-colors ${
          withoutScriptopia ? "site-lander-bg" : ""
        }`}
      >
        <div className="grid grid-cols-4 gap-4 mt-20 relative">
          {features.map((feature, index) => (
            <Card key={index} className="h-36 w-36">
              <CardBody className="flex gap-3 items-center justify-center text-center">
                {feature.icon}
                <p>{feature.title}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-32 h-full">
        <h2>How it Works</h2>
        <div className="flex h-full gap-20 w-[50%]">
          <div className="min-h-max bg-white drop-shadow-glow w-1 rounded-xl mt-16 overflow-visible relative">
            <div className="rounded-full bg-white h-6 w-6 absolute top-0 left-0 -translate-x-[11px] translate-y-[0px] drop-shadow-glow"></div>
            <div className="rounded-full bg-white h-6 w-6 absolute top-0 left-0 -translate-x-[11px] translate-y-[195px] drop-shadow-glow"></div>
            <div className="rounded-full bg-white h-6 w-6 absolute top-0 left-0 -translate-x-[11px] translate-y-[390px] drop-shadow-glow"></div>
            <div className="rounded-full bg-white h-6 w-6 absolute top-0 left-0 -translate-x-[11px] translate-y-[585px] drop-shadow-glow"></div>
            <div className="rounded-full bg-white h-6 w-6 absolute top-0 left-0 -translate-x-[11px] translate-y-[780px] drop-shadow-glow"></div>
          </div>
          <div className="flex flex-wrap gap-5 mt-5 w-[80vw]">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`w-[100%] gap-20 px-10 mt-10 drop-shadow-glow-light-dark h-[18vh]`}
              >
                <div className="text-2xl font-bold">{step.title}</div>
                <div className="opacity-50 mt-3">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-5xl font-caveat mt-20 text-center">
        Stay Tuned. Platform Launching Soon.
      </div>
    </div>
  );
};

export default Lander;
