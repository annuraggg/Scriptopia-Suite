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
  Users,
  Briefcase,
  PieChart,
  Calendar,
  BookOpenText,
  CreditCard,
  HelpCircle,
  ChevronRight,
  CircleUser,
  Bell,
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
      icon: Briefcase,
      label: "Jobs",
      link: "/jobs",
    },
    {
      icon: Users,
      label: "Candidates",
      link: "/candidates",
    },
    {
      icon: PieChart,
      label: "Analytics",
      link: "/analytics",
    },
    {
      icon: Calendar,
      label: "Calendar",
      link: "/calendar",
    },
  ];

  const bottomItems = [
    {
      icon: CircleUser,
      label: "Profile",
      link: "/profile"
    },
    {
      icon: Bell,
      label: "Notifications",
      link: "/notifications",
    },
    {
      icon: Settings,
      label: "Settings",
      link: "/settings",
    },
    {
      icon: CreditCard,
      label: "Billing",
      link: "/billing",
    },
    {
      icon: BookOpenText,
      label: "Documentation",
      link: "/documentation",
    },
    {
      icon: HelpCircle,
      label: "Support",
      link: "/support",
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
            <div>
              <img
                src="/logo1080_transparent_white_large.png"
                alt="logo"
                className="cursor-pointer h-6"
                onClick={() => {
                  window.location.href = "/";
                }}
              />
            </div>

            {topItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <table>
                    <tbody
                      className={` cursor-pointer h-8 ${
                        active === item.label.toLowerCase()
                          ? " text-white-500 rounded-xl"
                          : "text-muted-foreground opacity-50 hover:text-white"
                      } `}
                      onClick={() => {
                        navigate(
                          "/" +
                            window.location.pathname.split("/")[1] +
                            item.link
                        );
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
          <nav className={`mt-auto flex flex-col gap-4 sm:py-5`}>
            {bottomItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <table>
                    <tbody
                      className={` cursor-pointer h-7 ${
                        active === item.label.toLowerCase()
                          ? " text-white rounded-xl"
                          : "text-muted-foreground opacity-50 hover:text-white"
                      } `}
                      onClick={() => {
                        navigate(
                          "/" +
                            window.location.pathname.split("/")[1] +
                            item.link
                        );

                        setActive(item.label.toLowerCase());
                      }}
                    >
                      <td className="pr-3">
                        {item.icon && <item.icon className="h-5 w-5" />}
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

export default Sidebar;
