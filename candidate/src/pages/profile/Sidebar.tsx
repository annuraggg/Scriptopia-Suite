import { useNavigate } from "react-router-dom";
import { Tooltip } from "@nextui-org/tooltip";
import {
  ChevronRight,
  LucideIcon,
  ReceiptText,
  GraduationCap,
  BriefcaseBusiness,
  BookOpenText,
  BringToFrontIcon,
  Folder,
  Trophy,
  FileBadge2,
  Gem,
  Users,
  Copyright,
  School,
  Earth,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";

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
      icon: ReceiptText,
      label: "General",
      link: "/",
      visible: true,
    },
    {
      icon: GraduationCap,
      label: "Education",
      link: "/education",
      visible: true,
    },
    {
      icon: BriefcaseBusiness,
      label: "Work",
      link: "/work",
      visible: true,
    },
    {
      icon: BookOpenText,
      label: "Skills",
      link: "/skills",
      visible: true,
    },
    {
      icon: BringToFrontIcon,
      label: "Responsibilities",
      link: "/responsibilities",
      visible: true,
    },
    {
      icon: Folder,
      label: "Projects",
      link: "/projects",
      visible: true,
    },
    {
      icon: Trophy,
      label: "Awards",
      link: "/awards",
      visible: true,
    },
    {
      icon: FileBadge2,
      label: "Certifications",
      link: "/certifications",
      visible: true,
    },
    {
      icon: Gem,
      label: "Competitions",
      link: "/competitions",
      visible: true,
    },
    {
      icon: Users,
      label: "Conferences",
      link: "/conferences",
      visible: true,
    },
    {
      icon: Copyright,
      label: "Patents",
      link: "/patents",
      visible: true,
    },
    {
      icon: School,
      label: "Scholarships",
      link: "/scholarships",
      visible: true,
    },
    {
      icon: Earth,
      label: "Volunteering",
      link: "/volunteering",
      visible: true,
    },
    {
      icon: Plus,
      label: "Extra Curricular",
      link: "/extra-curricular",
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
                    navigate("/profile" + item.link);
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
