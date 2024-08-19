import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  ChevronRight,
  FileText,
  Workflow,
  LineChartIcon,
  MonitorPlay,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@nextui-org/badge";
import { Tooltip } from "@nextui-org/react";

const Sidebar = ({ drive }: { drive: any[] }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const workflowSteps = useMemo(() => drive?.workflow?.steps || [], [drive]);
  const getFilteredStepsCount = (types: string[]) =>
    workflowSteps.filter((step: any) => types.includes(step?.type)).length;

  const topItems = useMemo(
    () => [
      {
        icon: Home,
        label: "Dashboard",
        link: "/dashboard",
        visible: true,
        badge: 0,
      },
      {
        icon: Workflow,
        label: "Workflow",
        link: "/workflow",
        visible: true,
        badge: workflowSteps.length ? 0 : 1,
      },
      {
        icon: FileText,
        label: "ATS",
        link: "/ats",
        visible: getFilteredStepsCount(["rs"]) > 0,
        badge: getFilteredStepsCount(["rs"]) && drive?.ats ? 0 : 1,
      },
      {
        icon: LineChartIcon,
        label: "Assessments",
        link: "/assessments",
        visible: getFilteredStepsCount(["ca", "mcqca", "mcqa"]) > 0,
        badge:
          getFilteredStepsCount(["ca", "mcqca", "mcqa"]) -
          (drive?.assessments?.length || 0),
      },
      {
        icon: MonitorPlay,
        label: "Assignments",
        link: "/assignments",
        visible: getFilteredStepsCount(["as"]) > 0,
        badge:
          getFilteredStepsCount(["as"]) - (drive?.assignments?.length || 0),
      },
      {
        icon: MonitorPlay,
        label: "Interviews",
        link: "/interviews",
        visible: getFilteredStepsCount(["pi"]) > 0,
        badge: getFilteredStepsCount(["pi"]) - (drive?.interview?.length || 0),
      },
      {
        icon: Users,
        label: "Candidates",
        link: "/candidates",
        visible: true,
      },
    ],
    [drive, workflowSteps]
  );

  useEffect(() => {
    const currentPath = window.location.pathname.split("/")[4];
    setActive(currentPath);
  }, []);

  const handleNavigation = (item: any) => {
    if (!item.visible) {
      toast.warning(`${item.label} not configured for this drive`);
      return;
    }

    const path = window.location.pathname.split("/").slice(0, 4);
    navigate(path.join("/") + item.link);
    setActive(item.label.toLowerCase());
  };

  return (
    <aside
      className={`sticky h-[100vh] min-w-16 px-5 top-0 left-0 hidden transition-width flex-col border-r bg-background sm:flex overflow-x-hidden ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <nav className="flex flex-col gap-4 sm:py-5">
        {topItems.map((item, index) => (
          <Tooltip
            key={index}
            content={item.label}
            placement="right"
            color="secondary"
          >
            <table>
              <tbody
                className={`${
                  item.visible
                    ? "hover:text-white opacity-100 cursor-pointer"
                    : "opacity-10 cursor-not-allowed"
                } h-8 ${
                  active === item.label.toLowerCase()
                    ? "text-white-500 rounded-xl"
                    : "text-muted-foreground"
                }`}
                onClick={() => handleNavigation(item)}
              >
                <td className="pr-3">
                  <Badge
                    content={item.badge || 0}
                    color="danger"
                    className={!item.badge ? "hidden" : ""}
                  >
                    {item.icon && <item.icon className="h-7 w-5" />}
                  </Badge>
                </td>
                {!collapsed && (
                  <td className="text-start w-full">{item.label}</td>
                )}
              </tbody>
            </table>
          </Tooltip>
        ))}
      </nav>

      <div className="flex w-full mb-5 bottom-0 absolute">
        <Tooltip>
          <ChevronRight
            className={`h-5 w-5 text-muted-foreground transition-all opacity-50 ${
              !collapsed ? "rotate-180" : ""
            }`}
            onClick={() => setCollapsed(!collapsed)}
          />
        </Tooltip>
      </div>
    </aside>
  );
};

export default Sidebar;
