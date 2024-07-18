import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Home,
  Settings,
  Workflow,
  FileText,
  LineChartIcon,
  MonitorPlay,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const topItems = [
    {
      icon: Home,
      label: "Dashboard",
      link: "/dashboard",
    },
    {
      icon: Workflow,
      label: "Workflow",
      link: "/workflow",
    },
    {
      icon: FileText,
      label: "ATS",
      link: "/ats",
    },
    {
      icon: LineChartIcon,
      label: "Assessments",
      link: "/assessments",
    },
    {
      icon: Users,
      label: "Candidates",
      link: "/candidates",
    },
    {
      icon: MonitorPlay,
      label: "Interviews",
      link: "/interviews",
    },
  ];

  const [active, setActive] = useState("dashboard");
  useEffect(() => {
    setActive(window.location.pathname.split("/")[3]);
  }, []);

  return (
    <TooltipProvider>
      <aside className="fixed top-14 inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {topItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  to={"/postings/test" + item.link}
                  onClick={() => setActive(item.label.toLowerCase())}
                  className={`flex h-9 w-9 items-center ${
                    active === item.label.toLowerCase()
                      ? " text-gray-500 bg-gray-800 rounded-xl"
                      : "text-muted-foreground hover:text-white"
                  } justify-center rounded-lg transition-colors  md:h-8 md:w-8`}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/settings"
                className={`flex h-9 w-9 items-center ${
                  active === "settings"
                    ? " text-black bg-white"
                    : "text-muted-foreground hover:text-white"
                } justify-center rounded-lg transition-colors  md:h-8 md:w-8`}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
