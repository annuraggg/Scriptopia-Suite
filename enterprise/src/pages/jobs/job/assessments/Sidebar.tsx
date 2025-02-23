import { useState } from "react";
import { IconCopy, IconCode } from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

interface NavItem {
  icon: typeof IconCopy;
  label: string;
  hash: string;
  badge?: number;
}

interface SidebarProps {
  active: number;
  setActive: (number: number) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ active, setActive, isMobile, onClose }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen, onOpenChange } = useDisclosure();

  const navItems: NavItem[] = [
    {
      icon: IconCopy,
      label: "MCQ Assessments",
      hash: "mcqcreated",
    },
    {
      icon: IconCode,
      label: "Code Assessments",
      hash: "codecreated",
    },
  ];

  const handleNavigation = (index: number, hash: string) => {
    setActive(index);
    window.location.hash = hash;
    if (isMobile) onClose?.();
  };

  const renderNavItem = (item: NavItem, index: number) => {
    return (
      <Tooltip
        key={index}
        content={item.label}
        placement="right"
        isDisabled={isMobile || !collapsed}
      >
        <div onClick={() => handleNavigation(index, item.hash)}>
          <div
            className={`flex items-center p-2 py-3 rounded-lg cursor-pointer transition-colors duration-200
              ${
                active === index
                  ? "bg-primary text-foreground"
                  : "text-default hover:bg-accent/40"
              }`}
          >
            <div className="min-w-[24px] flex items-center justify-center">
              <Badge
                content={item.badge || 0}
                color="danger"
                isInvisible={!item.badge}
              >
                <item.icon className="w-6 h-6" />
              </Badge>
            </div>
            {(!collapsed || isMobile) && (
              <span className="ml-3 text-sm font-medium">{item.label}</span>
            )}
          </div>
        </div>
      </Tooltip>
    );
  };

  return (
    <aside
      className={`h-[100vh] bg-foreground text-background rounded-r-2xl
        flex flex-col overflow-hidden transition-all duration-300 border-l border-l-background/10
        ${isMobile ? "w-64" : collapsed ? "w-16" : "w-[300px]"}
        ${isMobile ? "fixed left-0 top-0" : "relative"}`}
    >
      <nav className="flex flex-col gap-2 p-3 flex-grow">
        {navItems.map((item, index) => renderNavItem(item, index))}
      </nav>

      <div className="p-3">
        {!isMobile && (
          <div className="flex">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="w-8 h-8"
              onPress={() => setCollapsed(!collapsed)}
            >
              <ChevronRight
                className={`h-5 w-5 transition-transform duration-200 text-background
                  ${!collapsed ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Details</ModalHeader>
              <ModalBody>Content details here</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
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
