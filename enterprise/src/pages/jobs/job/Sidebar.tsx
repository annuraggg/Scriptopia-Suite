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
import { Divider, Tooltip } from "@nextui-org/react";
import { Posting } from "@shared-types/Posting";

const Sidebar = ({ posting }: { posting: Posting }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const workflowSteps = useMemo(
    () => posting?.workflow?.steps || [],
    [posting]
  );
  const getFilteredStepsCount = (types: string[]) =>
    workflowSteps.filter((step: { type: string }) => types.includes(step?.type))
      .length;

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
        badge: getFilteredStepsCount(["rs"]) && posting?.ats ? 0 : 1,
      },
      {
        icon: LineChartIcon,
        label: "Assessments",
        link: "/assessments",
        visible: getFilteredStepsCount(["ca", "mcqca", "mcqa"]) > 0,
        badge:
          getFilteredStepsCount(["ca", "mcqca", "mcqa"]) -
          (posting?.assessments?.length || 0),
      },
      {
        icon: MonitorPlay,
        label: "Assignments",
        link: "/assignments",
        visible: getFilteredStepsCount(["as"]) > 0,
        badge:
          getFilteredStepsCount(["as"]) - (posting?.assignments?.length || 0),
      },
      {
        icon: MonitorPlay,
        label: "Interviews",
        link: "/interviews",
        visible: getFilteredStepsCount(["pi"]) > 0,
        badge: getFilteredStepsCount(["pi"]) - (posting?.interview ? 0 : 1),
      },
      {
        icon: Users,
        label: "Candidates",
        link: "/candidates",
        visible: true,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [posting, workflowSteps]
  );

  useEffect(() => {
    const currentPath = window.location.pathname.split("/")[4];
    setActive(currentPath);
  }, []);

  const handleNavigation = (item: {
    label: string;
    link: string;
    visible: boolean;
  }) => {
    if (!item.visible) {
      toast.warning(`${item.label} not configured for this posting`);
      return;
    }

    const path = window.location.pathname.split("/").slice(0, 3);
    navigate(path.join("/") + item.link);
    setActive(item.label.toLowerCase());
  };

  const hasCompletedAllSteps = useMemo(() => {
    const steps = posting?.workflow?.steps || [];
    if (steps.length === 0) {
      return -1;
    }

    let totalCompleted = 0;
    steps.forEach((step) => {
      if (step.type === "rs" && posting?.ats) {
        totalCompleted++;
      }

      if (step.type === "ca" || step.type === "mcqa" || step.type === "mcqca") {
        if (posting?.assessments?.filter((a) => a.name === step.name).length) {
          totalCompleted++;
        }
      }

      if (step.type === "as") {
        if (posting?.assignments?.filter((a) => a.name === step.name).length) {
          totalCompleted++;
        }
      }

      if (step.type === "pi" && posting?.interview) {
        totalCompleted++;
      }
    });

    // alert("TOTAL: " + totalCompleted + " STEPS: " + steps.length);
    if (totalCompleted === steps.length) {
      return 1;
    }

    return 0;
  }, [posting]);

  return (
    <aside
      className={`sticky h-[100vh] min-w-16 px-5 top-0 left-0  transition-width flex-col border-r bg-background sm:flex overflow-x-hidden ${
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
                    className={!item.badge || item.badge < 0 ? "hidden" : ""}
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

      <Divider />
      {hasCompletedAllSteps === 1 && (
        <nav
          className={`flex flex-col gap-4 sm:py-5 text-success-500 text-xs absolute bottom-10 pr-5 delay-200 overflow-hidden whitespace-nowrap   ${
            !collapsed ? "visible" : "hidden"
          } `}
        >
          All workflow steps completed
        </nav>
      )}

      {hasCompletedAllSteps === 0 && (
        <nav
          className={`flex flex-col gap-4 sm:py-5 text-warning-500 text-xs absolute bottom-10 pr-5 delay-200 whitespace-nowrap overflow-visible  ${
            !collapsed ? "visible" : "hidden"
          } `}
        >
          Complete all the workflow steps <br /> to publish this posting
        </nav>
      )}

      {hasCompletedAllSteps === -1 && (
        <nav
          className={`flex flex-col gap-4 sm:py-5 text-danger-500 text-xs absolute bottom-10 pr-5 delay-200 overflow-hidden whitespace-nowrap   ${
            !collapsed ? "visible" : "hidden"
          } `}
        >
          Workflow not initialized
        </nav>
      )}

      <div className="flex w-full mb-5 bottom-0 absolute">
        <Tooltip>
          <ChevronRight
            className={`h-5 w-5 text-muted-foreground transition-all opacity-50 cursor-pointer ${
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
