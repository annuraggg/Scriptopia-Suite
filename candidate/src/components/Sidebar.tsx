import { useNavigate } from "react-router-dom";
import { Tooltip } from "@nextui-org/tooltip";
import {
  Home,
  Settings,
  HelpCircle,
  ChevronRight,
  Bell,
  LucideIcon,
  User,
  FileText,
  ClockAlert,
  Briefcase,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import { Badge } from "@nextui-org/react";

interface SidebarProps {
  icon: LucideIcon;
  label: string;
  link: string;
  visible?: boolean;
  length?: number;
}

const Sidebar = () => {
  const topItems: SidebarProps[] = [
    {
      icon: Home,
      label: "Home",
      link: "/home",
      visible: true,
    },
    {
      icon: User,
      label: "Profile",
      link: "/profile",
      visible: true,
    },
    {
      icon: FileText,
      label: "Resume",
      link: "/resume",
      visible: true,
    },
    {
      icon: Briefcase,
      label: "My Jobs",
      link: "/myjobs",
      visible: true,
    },
    {
      icon: ClockAlert,
      label: "Alerts",
      link: "/alerts",
      visible: true
    }
  ];

  const bottomItems: SidebarProps[] = [
    {
      icon: Bell,
      label: "Notifications",
      link: "/notifications",
      visible: true,
    },
    {
      icon: Settings,
      label: "Settings",
      link: "/settings",
      visible: true,
    },
    {
      icon: HelpCircle,
      label: "Support",
      link: "/support",
      visible: true,
    },
  ];

  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setActive(window.location.pathname.split("/")[2]);
  }, []);

  return (
    <>
      <aside
        className={` sticky h-[100vh] min-w-16 px-5 top-0 left-0 z-10 hidden transition-width flex-col border-r bg-background sm:flex overflow-x-hidden ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <nav className={`flex flex-col gap-4 sm:py-5 `}>
          <div>
            <img
              src="/logo.png"
              alt="logo"
              className="cursor-pointer h-6"
              onClick={() => {
                window.location.href = "/";
              }}
            />
          </div>

          {topItems.map((item, index) => (
            <Tooltip key={index} content={item.label} placement="right">
              <table className={!item.visible ? "hidden" : ""}>
                <tbody
                  className={`cursor-pointer h-8 ${
                    active === item.label.toLowerCase()
                      ? " text-white-500 rounded-xl"
                      : "text-muted-foreground opacity-50 hover:text-white"
                  } `}
                  onClick={() => {
                    navigate(item.link);
                    setActive(item.label.toLowerCase());
                  }}
                >
                  <tr>
                    <td className="pr-3">
                      {item.icon && <item.icon className="h-7 w-5" />}
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
        <nav className={`mt-auto flex flex-col gap-4 sm:py-5`}>
          <div className="-ml-1">
            <UserButton />
          </div>
          {bottomItems.map((item, index) => (
            <Tooltip key={index} content={item.label} placement="right">
              <table className={!item.visible ? "hidden" : ""}>
                <tbody
                  className={`cursor-pointer h-7 ${
                    active === item.label.toLowerCase()
                      ? " text-white rounded-xl"
                      : "text-muted-foreground opacity-50 hover:text-white"
                  } `}
                  onClick={() => {
                    navigate(item.link);
                    setActive(item.label.toLowerCase());
                  }}
                >
                  <tr>
                    <td className="pr-3">
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
                          item.icon && <item.icon className="h-5 w-5" />
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
