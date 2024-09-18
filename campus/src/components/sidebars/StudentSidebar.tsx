import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Home,
  Settings,
  Briefcase,
  ChevronRight,
  Bell,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UserButton /*useAuth*/ } from "@clerk/clerk-react";

const StudentSidebar = () => {
  const topItems = [
    {
      icon: Home,
      label: "Dashboard",
      link: "/student-portal/dashboard",
      visible: true,
    },
    {
      icon: User,
      label: "Profile",
      link: "/student-portal/profile",
      visible: true,
    },
    {
      icon: Briefcase,
      label: "Drives",
      link: "/student-portal/drives",
      visible: true,
    },
  ];

  const bottomItems = [
    {
      icon: Bell,
      label: "Notifications",
      link: "/student-portal/notifications",
      visible: true,
    },
    {
      icon: Settings,
      label: "Settings",
      link: "/student-portal/settings/general",
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
      <TooltipProvider>
        <aside
          className={` sticky h-[100vh] min-w-16 px-5 top-0 left-0 z-10 hidden transition-width flex-col border-r bg-background sm:flex overflow-x-hidden ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          <nav className={`flex flex-col gap-4 sm:py-5 `}>
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="logo"
                className="cursor-pointer min-h-6 max-h-6 min-w-7 max-w-7"
                onClick={() => {
                  window.location.href = "/";
                }}
              />
              <p className={collapsed ? "hidden" : ""}>Placements</p>
            </div>

            {topItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </nav>
          <nav className={`mt-auto flex flex-col gap-4 sm:py-5`}>
            <div className="-ml-1">
              <UserButton />
            </div>
            {bottomItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
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
                          {item.label === "Profile" ? (
                            <div className="flex items-center justify-center user-button-small">
                              <UserButton />
                            </div>
                          ) : (
                            item.icon && <item.icon className="h-5 w-5" />
                          )}
                        </td>
                        {collapsed ? null : (
                          <td className="text-start w-full">{item.label}</td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </nav>

          <div className={` flex w-full mb-5 `}>
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

export default StudentSidebar;
