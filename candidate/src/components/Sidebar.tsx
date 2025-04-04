import { Tooltip } from "@nextui-org/react";
import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBellFilled,
  IconBookFilled,
  IconBriefcaseFilled,
  IconFileDescriptionFilled,
  IconFileTextFilled,
  IconLayoutDashboardFilled,
  IconUserFilled,
  IconLayoutKanbanFilled,
  IconFolderFilled,
  IconTrophyFilled,
  IconRosetteDiscountCheckFilled,
  IconDiamondFilled,
  IconCopyrightFilled,
  IconGlobeFilled,
  IconSquareRoundedPlusFilled,
  IconColorPicker,
  IconBooks,
} from "@tabler/icons-react";

interface SidebarProps {
  icon: React.ElementType;
  label: string;
  link: string;
  visible?: boolean;
  length?: number;
  children?: SidebarProps[];
}

const profileItems: SidebarProps[] = [
  {
    icon: IconFileDescriptionFilled,
    label: "General",
    link: "/profile",
    visible: true,
  },
  {
    icon: IconBookFilled,
    label: "Education",
    link: "/profile/education",
    visible: true,
  },
  {
    icon: IconBriefcaseFilled,
    label: "Work",
    link: "/profile/work",
    visible: true,
  },
  {
    icon: IconColorPicker,
    label: "Skills",
    link: "/profile/skills",
    visible: true,
  },
  {
    icon: IconLayoutKanbanFilled,
    label: "Responsibilities",
    link: "/profile/responsibilities",
    visible: true,
  },
  {
    icon: IconFolderFilled,
    label: "Projects",
    link: "/profile/projects",
    visible: true,
  },
  {
    icon: IconTrophyFilled,
    label: "Awards",
    link: "/profile/awards",
    visible: true,
  },
  {
    icon: IconRosetteDiscountCheckFilled,
    label: "Certifications",
    link: "/profile/certifications",
    visible: true,
  },
  {
    icon: IconDiamondFilled,
    label: "Competitions",
    link: "/profile/competitions",
    visible: true,
  },
  {
    icon: IconUserFilled,
    label: "Conferences",
    link: "/profile/conferences",
    visible: true,
  },
  {
    icon: IconCopyrightFilled,
    label: "Patents",
    link: "/profile/patents",
    visible: true,
  },
  {
    icon: IconBooks,
    label: "Scholarships",
    link: "/profile/scholarships",
    visible: true,
  },
  {
    icon: IconGlobeFilled,
    label: "Volunteering",
    link: "/profile/volunteering",
    visible: true,
  },
  {
    icon: IconSquareRoundedPlusFilled,
    label: "Extra Curricular",
    link: "/profile/extra-curricular",
    visible: true,
  },
];

const topItems: SidebarProps[] = [
  {
    icon: IconLayoutDashboardFilled,
    label: "Dashboard",
    link: "/dashboard",
    visible: true,
  },
  {
    icon: IconUserFilled,
    label: "Profile",
    link: "/profile",
    visible: true,
    children: profileItems,
  },
  {
    icon: IconFileTextFilled,
    label: "Resume",
    link: "/resume",
    visible: true,
  },
  { icon: IconBriefcaseFilled, label: "Jobs", link: "/jobs", visible: true },
  { icon: IconBookFilled, label: "Campus", link: "/campus", visible: true },
];

const bottomItems: SidebarProps[] = [
  {
    icon: IconBellFilled,
    label: "Notifications",
    link: "/notifications",
    visible: true,
    length: 3,
  },
];

interface SidebarItemProps {
  item: SidebarProps;
  isActive: boolean;
  isExpanded: boolean;
  onClick: (item: SidebarProps) => void;
}

interface SidebarChildItemProps {
  child: SidebarProps;
  isActive: boolean;
  onClick: (item: SidebarProps) => void;
}

const SidebarItem = memo(
  ({ item, isActive, isExpanded, onClick }: SidebarItemProps) => {
    const Icon = item.icon;

    const className = useMemo(() => {
      return `cursor-pointer m-3 p-2 rounded-xl hover:bg-zinc-50/10 ${
        isActive || isExpanded ? "bg-zinc-50/10" : ""
      }`;
    }, [isActive, isExpanded]);

    const handleClick = useCallback(() => {
      onClick(item);
    }, [onClick, item]);

    return (
      <Tooltip content={item.label} placement="right">
        <div className={className} onClick={handleClick}>
          <Icon />
        </div>
      </Tooltip>
    );
  }
);

SidebarItem.displayName = "SidebarItem";

const SidebarChildItem = memo(
  ({ child, isActive, onClick }: SidebarChildItemProps) => {
    const Icon = child.icon;

    const className = useMemo(() => {
      return `cursor-pointer m-3 p-2 flex items-center rounded-xl hover:bg-zinc-50/10 ${
        isActive ? "bg-zinc-50/10" : ""
      }`;
    }, [isActive]);

    const handleClick = useCallback(() => {
      onClick(child);
    }, [onClick, child]);

    return (
      <div className={className} onClick={handleClick}>
        <Icon className="mr-3 min-w-6" />
        <p className="text-sm">{child.label}</p>
      </div>
    );
  }
);

SidebarChildItem.displayName = "SidebarChildItem";

const sidebarVariants = {
  hidden: {
    width: 0,
    opacity: 0,
    transform: "translateX(-20px)",
  },
  visible: {
    width: "14rem",
    opacity: 1,
    transform: "translateX(0px)",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      mass: 1,
    },
  },
  exit: {
    width: 0,
    opacity: 0,
    transform: "translateX(-20px)",
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
};

const Sidebar = (): JSX.Element => {
  const [active, setActive] = useState<string>("");
  const [expandedItem, setExpandedItem] = useState<SidebarProps | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const changePage = useCallback(
    (item: SidebarProps): void => {
      setActive(item.label);

      requestAnimationFrame(() => {
        navigate(item.link);

        if (item.children) {
          setExpandedItem((prev) => (prev?.label === item.label ? null : item));
        } else {
          const isTopOrBottomItem =
            topItems.some((topItem) => topItem.label === item.label) ||
            bottomItems.some((bottomItem) => bottomItem.label === item.label);

          if (isTopOrBottomItem) {
            setExpandedItem(null);
          }
        }
      });
    },
    [navigate]
  );

  useEffect(() => {
    const currentPath = location.pathname;

    const idleCallback =
      window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

    const handle = idleCallback(() => {
      const activeTopItem = topItems.find(
        (item) =>
          currentPath === item.link || currentPath.startsWith(`${item.link}/`)
      );

      if (activeTopItem) {
        setActive(activeTopItem.label);

        if (activeTopItem.children) {
          setExpandedItem(activeTopItem);

          const activeChild = activeTopItem.children.find(
            (child) =>
              currentPath === child.link ||
              currentPath.startsWith(`${child.link}/`)
          );

          if (activeChild) {
            setActive(activeChild.label);
          }
        }
      } else {
        const activeBottomItem = bottomItems.find(
          (item) =>
            currentPath === item.link || currentPath.startsWith(`${item.link}/`)
        );

        if (activeBottomItem) {
          setActive(activeBottomItem.label);
        }
      }
    });

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(handle);
      } else {
        clearTimeout(handle);
      }
    };
  }, [location.pathname]);

  const memoizedTopItems = useMemo(
    () => topItems.filter((item) => item.visible !== false),
    []
  );

  const memoizedBottomItems = useMemo(
    () => bottomItems.filter((item) => item.visible !== false),
    []
  );

  const memoizedExpandedChildren = useMemo(
    () =>
      expandedItem?.children?.filter((child) => child.visible !== false) || [],
    [expandedItem]
  );

  return (
    <div className="h-screen flex bg-foreground text-background">
      {/* Main sidebar always visible */}
      <div className="flex flex-col items-center justify-between py-5">
        <div>
          <img src="/logo.svg" alt="Logo" className="w-10 h-10 mb-5 mx-auto" />
          {memoizedTopItems.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              isActive={active === item.label}
              isExpanded={expandedItem?.label === item.label}
              onClick={changePage}
            />
          ))}
        </div>
        <div className="justify-self-end">
          {memoizedBottomItems.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              isActive={active === item.label}
              isExpanded={false}
              onClick={changePage}
            />
          ))}
        </div>
      </div>

      {/* Expandable sidebar panel with optimized animation */}
      <AnimatePresence mode="wait">
        {expandedItem?.children && (
          <motion.div
            className="bg-foreground text-background py-2 px-4 shadow-lg overflow-y-auto"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            style={{
              willChange: "transform, width, opacity",
              translateZ: 0,
              backfaceVisibility: "hidden",
            }}
            layoutRoot
          >
            {memoizedExpandedChildren.map((child) => (
              <SidebarChildItem
                key={child.label}
                child={child}
                isActive={active === child.label}
                onClick={changePage}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

declare global {
  interface Window {
    requestIdleCallback: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => number;
    cancelIdleCallback: (handle: number) => void;
  }
}

export default Sidebar;
