import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Home,
  Users,
  ChevronRight,
  FileText,
  Workflow,
  LineChartIcon,
  MonitorPlay,
} from "lucide-react";
import { useEffect, useState } from "react";

const Sidebar = ({ drive }: { drive: any[] }) => {
  const topItems = [
    {
      icon: Home,
      label: "Dashboard",
      link: "/dashboard",
      visible: true,
    },
    {
      icon: Workflow,
      label: "Workflow",
      link: "/workflow",
      visible: true,
    },
    {
      icon: FileText,
      label: "ATS",
      link: "/ats",
      visible: drive?.ats ? true : false,
    },
    {
      icon: LineChartIcon,
      label: "Assessments",
      link: "/assessments",
      visible: drive?.assessments?.length > 0,
    },
    {
      icon: MonitorPlay,
      label: "Assignments",
      link: "/assignments",
      visible: drive?.assignments?.length > 0,
    },
    {
      icon: MonitorPlay,
      label: "Interviews",
      link: "/interviews",
      visible: drive?.interview ? true : false,
    },
    {
      icon: Users,
      label: "Candidates",
      link: "/candidates",
      visible: true,
    },
  ];

  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setActive(window.location.pathname.split("/")[4]);
  }, []);

  return (
    <>
      <TooltipProvider>
        <aside
          className={` sticky h-[100vh] min-w-16 px-5 top-0 left-0 hidden transition-width flex-col border-r bg-background sm:flex overflow-x-hidden ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          <nav className={`flex flex-col gap-4 sm:py-5 `}>
            {topItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <table>
                    <tbody
                      className={`${
                        item.visible
                          ? "hover:text-white opacity-100 cursor-pointer"
                          : "opacity-10 cursor-not-allowed"
                      } h-8 ${
                        active === item.label.toLowerCase()
                          ? " text-white-500 rounded-xl"
                          : "text-muted-foreground"
                      } `}
                      onClick={() => {
                        const path = window.location.pathname.split("/");
                        path.pop();
                        navigate(path.join("/") + item.link);
                        setActive(item.label.toLowerCase());
                      }}
                    >
                      <td className="pr-3">
                        {item.icon && <item.icon className="h-7 w-5" />}
                      </td>
                      {collapsed ? null : (
                        <td className="text-start w-full">{item.label}</td>
                      )}
                    </tbody>
                  </table>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </nav>

          <div className={` flex w-full mb-5 bottom-0 absolute `}>
            <Tooltip>
              <TooltipTrigger>
                <ChevronRight
                  className={`h-5 w-5 text-muted-foreground transition-all  opacity-50 ${
                    !collapsed ? "rotate-180" : ""
                  }`}
                  onClick={() => setCollapsed(!collapsed)}
                />
              </TooltipTrigger>
              <TooltipContent side="right">Collapse sidebar</TooltipContent>
            </Tooltip>
          </div>
        </aside>
      </TooltipProvider>
    </>
  );
};

export default Sidebar;
