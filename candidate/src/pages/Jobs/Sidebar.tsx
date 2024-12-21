import { useNavigate } from "react-router-dom";
import { Tooltip } from "@nextui-org/tooltip";
import {
  ChevronRight,
  LucideIcon,
  BookMarked,
  MonitorCog,
  Headset,
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
      icon: MonitorCog,
      label: "Control Panel",
      link: "/",
      visible: true,
    },
    {
      icon: BookMarked,
      label: "My Jobs",
      link: "/myjobs",
      visible: true,
    },
    {
      icon: Headset,
      label: "Interviews",
      link: "/interviews",
      visible: true,
    }
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
                    navigate("/jobs" + item.link);
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

        <div className={`absolute bottom-5 left-5`}>
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
