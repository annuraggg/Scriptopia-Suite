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
import { Button, Skeleton, Tooltip } from "@nextui-org/react";
import { Posting } from "@shared-types/Posting";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { Assessment } from "@shared-types/Assessment";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

const Sidebar = ({
  posting,
  loading,
}: {
  posting: Posting;
  loading: boolean;
}) => {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        badge: getFilteredStepsCount(["pi"]) - (posting?.interview ? 1 : 0),
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
        if (
          posting?.assessments?.filter((a) => a.assessmentId === step.stepId)
            .length
        ) {
          totalCompleted++;
        }
      }

      if (step.type === "as") {
        if (
          posting?.assignments?.filter((a) => {
            return a._id === step.stepId;
          }).length
        ) {
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

  const { getToken } = useAuth();
  const axios = ax(getToken);
  const publishPosting = () => {
    axios
      .post("/postings/publish", { id: posting._id })
      .then(() => {
        toast.success("Posting published successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(() => {
        toast.error("Error publishing posting");
      });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/postings/${posting?.url}`
    );
    toast.success("Link copied to clipboard");
  };

  return (
    <aside
      className={`sticky h-[100vh]  left-0  transition-width flex-col flex justify-between border-r bg-background sm:flex ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <nav className="flex flex-col gap-4 sm:py-5 px-5">
        {topItems.map((item, index) => (
          <Skeleton isLoaded={!loading} key={index}>
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
                  <tr>
                    <td className="pr-3">
                      <Badge
                        content={item.badge || 0}
                        color="danger"
                        className={
                          !item.badge || item.badge < 0 ? "hidden" : ""
                        }
                      >
                        {item.icon && <item.icon className="h-7 w-5" />}
                      </Badge>
                    </td>
                    {!collapsed && (
                      <td className="text-start w-full">{item.label}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </Tooltip>
          </Skeleton>
        ))}
      </nav>

      <div>
        <div className="w-full mb-5 px-5">
          <Skeleton isLoaded={!loading}>
            {hasCompletedAllSteps === 1 && posting.published && (
              <>
                <nav
                  className={`flex flex-col gap-4 w-full text-success-500 text-xs delay-200 whitespace-nowrap overflow-hidden ${
                    !collapsed ? "visible" : "hidden"
                  }`}
                >
                  Posting is currently live 😊
                  <Button onClick={copyLink}>Copy link</Button>
                </nav>

                <div
                  className={`w-5 relative ${
                    !collapsed ? "hidden" : "visible"
                  }`}
                >
                  <div className="bg-success-500 absolute top-0 bottom-0 blur-sm w-3 h-3 rounded-full  opacity-70   my-auto mx-auto right-0 left-0 animate-pulse"></div>
                  <div className="bg-success-500 w-2 h-2 rounded-full    my-auto mx-auto right-0 left-0"></div>
                </div>
              </>
            )}

            {hasCompletedAllSteps === 1 && !posting.published && (
              <>
                {" "}
                <nav
                  className={`flex flex-col gap-4 w-full text-warning-500 text-xs delay-200 whitespace-nowrap overflow-hidden  ${
                    !collapsed ? "visible" : "hidden"
                  } `}
                >
                  All workflow steps completed
                  <br /> Your Posting is ready to publish
                  <br /> <Button onClick={onOpen}> 🚀 Publish </Button>
                </nav>
                <div
                  className={` w-5 relative ${
                    !collapsed ? "hidden" : "visible"
                  }`}
                >
                  <div className="bg-warning-500 absolute top-0 bottom-0 blur-sm w-3 h-3 rounded-full opacity-70  my-auto mx-auto right-0 left-0 animate-pulse"></div>
                  <div className="bg-warning-500 w-2 h-2 rounded-full   my-auto mx-auto right-0 left-0"></div>
                </div>
              </>
            )}

            {hasCompletedAllSteps === 0 && !posting.published && (
              <>
                {" "}
                <nav
                  className={`flex flex-col gap-4 w-full text-danger-500 text-xs delay-200 whitespace-nowrap overflow-hidden  ${
                    !collapsed ? "visible" : "hidden"
                  } `}
                >
                  Complete all the workflow <br />
                  steps to publish this posting
                </nav>
                <div
                  className={` w-5 relative ${
                    !collapsed ? "hidden" : "visible"
                  }`}
                >
                  <div className="bg-danger-500 absolute top-0 bottom-0 blur-sm w-3 h-3 rounded-full  opacity-70   my-auto mx-auto right-0 left-0 animate-pulse"></div>
                  <div className="bg-danger-500 w-2 h-2 rounded-full    my-auto mx-auto right-0 left-0"></div>
                </div>
              </>
            )}

            {hasCompletedAllSteps === -1 && !posting.published && (
              <>
                <nav
                  className={`flex flex-col gap-4 w-full text-danger-500 text-xs delay-200 whitespace-nowrap overflow-hidden  ${
                    !collapsed ? "visible" : "hidden"
                  } `}
                >
                  Workflow not initialized
                </nav>
                <div
                  className={` w-5 relative ${
                    !collapsed ? "hidden" : "visible"
                  }`}
                >
                  <div className="bg-danger-500 blur-sm w-3 h-3 absolute top-0 bottom-0 rounded-full  opacity-70   my-auto mx-auto right-0 left-0 animate-pulse"></div>
                  <div className="bg-danger-500 w-2 h-2 rounded-full    my-auto mx-auto right-0 left-0"></div>
                </div>
              </>
            )}
          </Skeleton>
        </div>

        <div className="flex w-full mb-5 px-5">
          <Tooltip>
            <ChevronRight
              className={`h-5 w-5 text-muted-foreground transition-all opacity-50 cursor-pointer ${
                !collapsed ? "rotate-180" : ""
              }`}
              onClick={() => setCollapsed(!collapsed)}
            />
          </Tooltip>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Publish Posting
              </ModalHeader>
              <ModalBody>
                Are you sure you want to publish this posting? This action
                cannot be undone.
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" onPress={publishPosting}>
                  Publish
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </aside>
  );
};

export default Sidebar;
