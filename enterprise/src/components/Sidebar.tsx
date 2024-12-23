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
} from "lucide-react";
import { useEffect, useState } from "react";
import { UserButton /*useAuth*/ } from "@clerk/clerk-react";
import { Badge } from "@nextui-org/react";
import { MemberWithPermission } from "@shared-types/MemberWithPermission";
import { Notification } from "@shared-types/Organization";
import { OrganizationWithPostings as OWP } from "@/types/RootContext";
// import { useTheme } from "./theme-provider";

const Sidebar = ({
  notifications,
  user,
}: {
  notifications: Notification[];
  org: OWP;
  user: MemberWithPermission;
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
    <>
      <aside
        className={` sticky h-[100vh] min-w-16 px-3 top-0 left-0 z-10 hidden transition-width flex-col border-r bg-background sm:flex overflow-x-hidden ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <nav className={`flex flex-col gap-4 sm:py-5 `}>
          <div>
            <img
              src="/logo.png"
              alt="logo"
              className="cursor-pointer h-6 ml-2"
              onClick={() => {
                window.location.href = "/";
              }}
            />
          </div>

          {topItems.map((item, index) => (
            <Tooltip key={index} content={item.label} placement="right">
              <table className={!item.visible ? "hidden" : ""}>
                <tbody
                  className={`cursor-pointer ${
                    active?.toLowerCase() === item.label.toLowerCase()
                      ? "rounded-xl"
                      : " text-default-500"
                  } `}
                  onClick={() => {
                    navigate(item.link);
                    setActive(item.label.toLowerCase());
                  }}
                >
                  <tr>
                    <td>
                      {item.icon && (
                        <div
                          className={` p-2 rounded-xl mr-3 max-w-fit  ${
                            active?.toLowerCase() === item.label.toLowerCase()
                              ? "bg-default"
                              : ""
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    {collapsed ? null : (
                      <td className="text-start w-full">{item.label}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </Tooltip>
          ))}
        </nav>
        <nav className={`mt-auto flex flex-col gap-2 sm:py-5`}>
          <div className=" ml-[6px]">
            <UserButton />
          </div>
          {bottomItems.map((item, index) => (
            <Tooltip key={index} content={item.label} placement="right">
              <table className={!item.visible ? "hidden" : ""}>
                <tbody
                  className={`cursor-pointer ${
                    active?.toLowerCase() === item.label.toLowerCase()
                      ? "rounded-xl"
                      : " text-default-500"
                  } `}
                  onClick={() => {
                    navigate(item.link);
                    setActive(item.label.toLowerCase());
                  }}
                >
                  <tr>
                    <td>
                      <Badge
                        content={item?.length}
                        color="warning"
                        className={!item?.length ? "hidden" : ""}
                      >
                        {item.label === "Profile" ? (
                          <div className="flex items-center justify-center user-button-small">
                            <UserButton />
                          </div>
                        ) : (
                          item.icon && (
                            <div
                              className={` p-2 rounded-xl mr-3 max-w-fit  ${
                                active?.toLowerCase() ===
                                item.label.toLowerCase()
                                  ? "bg-default"
                                  : ""
                              }`}
                            >
                              <item.icon className="w-5 h-5" />
                            </div>
                          )
                        )}{" "}
                      </Badge>
                    </td>

                    {collapsed ? null : (
                      <td className="text-start w-full">{item.label}</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </Tooltip>
          ))}
        </nav>

        <div className={` flex w-full mb-5 `}>
          <Tooltip content="Collapse sidebar" placement="right">
            <ChevronRight
              className={`h-5 w-5 text-muted-foreground transition-all  opacity-50 ${
                !collapsed ? "rotate-180" : ""
              }`}
              onClick={() => setCollapsed(!collapsed)}
            />
          </Tooltip>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
