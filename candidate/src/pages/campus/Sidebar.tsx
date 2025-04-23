import { useNavigate } from "react-router-dom";
import { Tooltip } from "@heroui/tooltip";
import { X } from "lucide-react";
import { IconBriefcaseFilled, IconUsersGroup } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

interface SidebarProps {
  icon: any;
  label: string;
  link: string;
  visible?: boolean;
  length?: number;
}

const Sidebar = ({
  isMobile,
  onClose,
}: {
  isMobile?: boolean;
  onClose?: () => void;
}) => {
  const topItems: SidebarProps[] = [
    {
      icon: IconBriefcaseFilled,
      label: "Drives",
      link: "/drives",
      visible: true,
    },
    {
      icon: IconUsersGroup,
      label: "Placement Groups",
      link: "/placement-groups",
      visible: true,
    },
  ];

  const [active, setActive] = useState("dashboard");
  const [collapsed, _setCollapsed] = useState(false);
  const navigate = useNavigate();

  const subNavbarRoutes = ["profile"];

  useEffect(() => {
    setActive(window.location.pathname.split("/")[1]);
  }, []);

  return (
    <aside
      className={`h-[100vh] bg-foreground text-background ${
        subNavbarRoutes.includes(window.location.pathname.split("/")[1])
          ? "border-r-background/10"
          : "rounded-r-2xl"
      } border-r flex flex-col overflow-hidden transition-all duration-300 
        ${isMobile ? "w-64" : collapsed ? "w-16" : "w-64"}
        ${isMobile ? "fixed left-0 top-0 z-50" : "relative"}`}
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

      <nav className="flex flex-col gap-2 p-3 py-10">
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
                navigate("/campus" + item.link);
                setActive(item.label.toLowerCase());
                if (isMobile) onClose?.();
              }}
            >
              <div
                className={`flex items-center p-2 py-3 rounded-lg cursor-pointer transition-colors duration-200  
                  ${
                    active?.toLowerCase() === item.label.toLowerCase()
                      ? "bg-primary text-foreground"
                      : "text-default hover:bg-accent/40"
                  }`}
              >
                <div className="min-w-[24px] flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                {(!collapsed || isMobile) && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
              </div>
            </div>
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
