import { RootState } from "@/types/Reducer";
import { Button, Image, Switch } from "@nextui-org/react";
import {
  BriefcaseBusiness,
  FileText,
  Filter,
  Inbox,
  UserCheck,
  BarChart,
  Video,
  PieChart,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Timeline } from "./Timeline";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { useTheme } from "@/components/theme-provider";

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

  const [withoutScriptopia, setWithoutScriptopia] = useState(false);

  const { theme, setTheme } = useTheme();
  const switchTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="py-10 mx-20">
      <div className="flex gap-5 items-center justify-between  mb-5">
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
        <Button isIconOnly variant="flat" onClick={switchTheme}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>

      <div className="flex max-w-[100vw] h-[95vh] items-center">
        <div className="flex flex-col h-full mt-48">
          <h1 className="text-7xl max-w-[50vw] pr-48 font-poly leading-tight drop-shadow-glow">
            Industry Grade Screening and Hiring Platform.
          </h1>
          <div className="flex flex-row gap-5  w-[30vw] mt-10">
            <Button
              className="w-full hidden"
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
            <CardSpotlight
              className="flex items-center flex-col justify-center rounded-2xl h-36 w-36"
              key={index}
            >
              <p className="text-xl font-bold relative z-20 mt-2 text-white">
                {feature.icon}
              </p>
              <div className="text-neutral-200 mt-4 relative z-20">
                {feature.title}
              </div>
            </CardSpotlight>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-32 h-full">
        <h2>How it Works</h2>
        <Timeline />
      </div>

      <div className="text-5xl font-caveat mt-20 text-center">
        Stay Tuned. Platform Launching Soon.
      </div>
    </div>
  );
};

export default Lander;
