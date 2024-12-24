import { useNavigate } from "react-router-dom";
import { Tooltip } from "@nextui-org/tooltip";
import {
  Home,
  Settings,
  Users,
  Briefcase,
  PieChart,
  // BookOpenText,
  CreditCard,
  // HelpCircle,
  ChevronRight,
  Bell,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UserButton /*useAuth*/ } from "@clerk/clerk-react";
import { Badge, Button } from "@nextui-org/react";
import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { Notification } from "@shared-types/Organization";
import { OrganizationWithPostings as OWP } from "@/types/RootContext";
// import { useTheme } from "./theme-provider";

const Sidebar = ({
  notifications,
  user,
  isMobile,
  onClose,
}: {
  notifications: Notification[];
  org: OWP;
  user: MemberWithPermission;
  isMobile: boolean;
  onClose?: () => void;
}) => {
  const topItems = [
    {
      icon: Home,
      label: "Dashboard",
      link: "/dashboard",
      visible: true,
    },
    {
      icon: Briefcase,
      label: "Jobs",
      link: "/jobs",
      visible:
        user?.permissions?.includes("view_job") ||
        user?.permissions?.includes("manage_job"),
    },
    {
      icon: Users,
      label: "Candidates",
      link: "/candidates",
      visible:
        user?.permissions?.includes("view_job") ||
        user?.permissions?.includes("manage_job"),
    },
    {
      icon: PieChart,
      label: "Analytics",
      link: "/analytics",
      visible:
        user?.permissions?.includes("view_analytics") ||
        user?.permissions?.includes("manage_organization"),
    },
    // {
    //   icon: Calendar,
    //   label: "Calendar",
    //   link: "/calendar",
    //   visible: true,
    // },
  ];

  const bottomItems = [
    {
      icon: Bell,
      label: "Notifications",
      link: "/notifications",
      visible: true,
      length: notifications?.length,
    },
    {
      icon: Settings,
      label: "Settings",
      link: "/settings/general",
      visible: user?.permissions?.includes("manage_organization"),
    },
    {
      icon: CreditCard,
      label: "Billing",
      link: "/billing",
      visible:
        user?.permissions?.includes("view_billing") ||
        user?.permissions?.includes("manage_billing"),
    },
    // {
    //   icon: BookOpenText,
    //   label: "Documentation",
    //   link: "/documentation",
    //   visible: true,
    // },
    // {
    //   icon: HelpCircle,
    //   label: "Support",
    //   link: "/support",
    //   visible: true,
    // },
  ];

  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setActive(window.location.pathname.split("/")[1]);
  }, []);

  // const { theme, setTheme } = useTheme();
  // const switchTheme = () => {
  //   setTheme(theme === "dark" ? "light" : "dark");
  // };

  return (
    <aside
      className={`h-[100vh] bg-background border-r flex flex-col overflow-hidden transition-all duration-300 
        ${isMobile ? 'w-64' : collapsed ? 'w-16' : 'w-64'}
        ${isMobile ? 'fixed left-0 top-0' : 'relative'}`}
    >
      {/* Mobile Close Button */}
      {isMobile && (
        <Button
          isIconOnly
          variant="light"
          className="absolute top-4 right-4"
          onPress={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      )}

      <nav className="flex flex-col gap-4 p-3">
        {(!isMobile || !collapsed) && (
          <div className={`${isMobile ? "mt-12" : "mt-4"} mb-6`}>
            <img
              src="/logo.png"
              alt="logo"
              className="cursor-pointer h-6 ml-2"
              onClick={() => {
                window.location.href = "/";
              }}
            />
          </div>
        )}

        {topItems.map((item, index) => (
          <Tooltip
            key={index}
            content={item.label}
            placement="right"
            isDisabled={isMobile || !collapsed}
          >
            <div
              className={`${!item.visible ? "hidden" : ""}`}
              onClick={() => {
                navigate(item.link);
                setActive(item.label.toLowerCase());
                if (isMobile) onClose?.();
              }}
            >
              <div
                className={`flex items-center p-2 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-default/80
                  ${active?.toLowerCase() === item.label.toLowerCase()
                    ? "bg-default text-foreground"
                    : "text-default-500"
                  }`}
              >
                <div className="min-w-[24px] flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                {(!collapsed || isMobile) && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
              </div>
            </div>
          </Tooltip>
        ))}
      </nav>

      <nav className="mt-auto flex flex-col gap-2 p-3">
        <div className="ml-[6px] mb-4">
          <UserButton afterSignOutUrl="/" />
        </div>

        {bottomItems.map((item, index) => (
          <Tooltip
            key={index}
            content={item.label}
            placement="right"
            isDisabled={isMobile || !collapsed}
          >
            <div
              className={`${!item.visible ? "hidden" : ""}`}
              onClick={() => {
                navigate(item.link);
                setActive(item.label.toLowerCase());
                if (isMobile) onClose?.();
              }}
            >
              <div
                className={`flex items-center p-2 rounded-xl cursor-pointer transition-colors duration-200 
                  ${active?.toLowerCase() === item.label.toLowerCase()
                    ? ""
                    : "text-default-500"
                  }`}
              >
                <div className="min-w-[24px] flex items-center justify-center relative">
                  <Badge
                    content={item?.length}
                    color="warning"
                    className={!item?.length ? "hidden" : ""}
                  >
                    <item.icon className="w-5 h-5" />
                  </Badge>
                </div>
                {(!collapsed || isMobile) && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
              </div>
            </div>
          </Tooltip>
        ))}

        {/* Collapse Button */}
        {!isMobile && (
          <div className="flex w-full mt-4 px-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-xl transition-colors duration-200 w-full"
            >
              <ChevronRight
                className={`h-5 w-5 text-default-500 transition-transform duration-200 
                  ${!collapsed ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
