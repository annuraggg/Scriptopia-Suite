import { useNavigate } from "react-router-dom";
import { Tooltip } from "@heroui/tooltip";
import { ChevronRight } from "lucide-react";
import {
  IconFileDescriptionFilled,
  IconBriefcaseFilled,
  IconBookFilled,
  IconLayoutKanbanFilled,
  IconFolderFilled,
  IconTrophyFilled,
  IconRosetteDiscountCheckFilled,
  IconDiamondFilled,
  IconUserFilled,
  IconCopyrightFilled,
  IconGlobeFilled,
  IconSquareRoundedPlusFilled,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  icon: any; // Using any for Tabler icons compatibility
  label: string;
  link: string;
  visible?: boolean;
}

const Sidebar = () => {
  const menuItems: SidebarProps[] = [
    {
      icon: IconFileDescriptionFilled,
      label: "General",
      link: "/",
      visible: true,
    },
    {
      icon: IconBookFilled,
      label: "Education",
      link: "/education",
      visible: true,
    },
    {
      icon: IconBriefcaseFilled,
      label: "Work",
      link: "/work",
      visible: true,
    },
    {
      icon: IconSkillFilled,
      label: "Skills",
      link: "/skills",
      visible: true,
    },
    {
      icon: IconLayoutKanbanFilled,
      label: "Responsibilities",
      link: "/responsibilities",
      visible: true,
    },
    {
      icon: IconFolderFilled,
      label: "Projects",
      link: "/projects",
      visible: true,
    },
    {
      icon: IconTrophyFilled,
      label: "Awards",
      link: "/awards",
      visible: true,
    },
    {
      icon: IconRosetteDiscountCheckFilled,
      label: "Certifications",
      link: "/certifications",
      visible: true,
    },
    {
      icon: IconDiamondFilled,
      label: "Competitions",
      link: "/competitions",
      visible: true,
    },
    {
      icon: IconUserFilled,
      label: "Conferences",
      link: "/conferences",
      visible: true,
    },
    {
      icon: IconCopyrightFilled,
      label: "Patents",
      link: "/patents",
      visible: true,
    },
    {
      icon: IconGraduationFilled,
      label: "Scholarships",
      link: "/scholarships",
      visible: true,
    },
    {
      icon: IconGlobeFilled,
      label: "Volunteering",
      link: "/volunteering",
      visible: true,
    },
    {
      icon: IconSquareRoundedPlusFilled,
      label: "Extra Curricular",
      link: "/extra-curricular",
      visible: true,
    },
  ];

  const [active, setActive] = useState("");
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const subNavbarRoutes = ["education", "work", "skills"];

  useEffect(() => {
    setActive(window.location.pathname.split("/")[2]);
  }, []);

  return (
    <aside
      className={`h-[100vh] bg-foreground text-background ${
        subNavbarRoutes.includes(window.location.pathname.split("/")[1])
          ? "border-r-background/10"
          : "rounded-r-2xl"
      } border-r flex flex-col overflow-hidden transition-all duration-300 
        ${collapsed ? "w-16" : "w-64"} relative`}
    >
      <nav className="flex flex-col gap-2 p-3 flex-grow overflow-y-auto">
        {menuItems.map((item, index) => (
          <Tooltip
            key={index}
            content={item.label}
            placement="right"
            isDisabled={!collapsed}
          >
            <div
              className={`${!item.visible ? "hidden" : ""}`}
              onClick={() => {
                navigate("/profile" + item.link);
                setActive(item.label.toLowerCase());
              }}
            >
              <div
                className={`flex items-center p-2 py-3 rounded-lg cursor-pointer transition-colors duration-200  
                  ${
                    active === item.label.toLowerCase()
                      ? "bg-primary text-foreground"
                      : "text-default hover:bg-accent/40"
                  }`}
              >
                <div className="min-w-[24px] flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
              </div>
            </div>
          </Tooltip>
        ))}
      </nav>

      <div className="p-3 border-t border-background/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg transition-colors duration-200 w-full hover:bg-accent/40"
        >
          <ChevronRight
            className={`h-5 w-5 transition-transform duration-200 text-background
              ${!collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </aside>
  );
};

const IconGraduationFilled = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 48 48"
      id="Graduation-Cap--Streamline-Plump"
      height="22"
      width="22"
    >
      <desc>Graduation Cap Streamline Icon: https://streamlinehq.com</desc>
      <g id="graduation-cap--graduation-cap-education">
        <g id="Union">
          <path
            fill="#ffffff"
            d="M21.8207 4.13415c1.4168 -0.48355 2.9419 -0.48355 4.3587 0 1.9829 0.67671 5.6487 2.00253 10.9976 4.23121 3.8502 1.60428 6.5812 2.84664 8.4195 3.72734 1.1993 0.5745 1.888 1.705 1.888 2.9073 0 1.2023 -0.6887 2.3327 -1.888 2.9073 -1.8383 0.8806 -4.5693 2.123 -8.4195 3.7273 -5.3489 2.2287 -9.0147 3.5545 -10.9975 4.2312 -1.4169 0.4836 -2.942 0.4836 -4.3588 0 -1.9829 -0.6767 -5.6487 -2.0025 -10.9976 -4.2312 -1.63771 -0.6824 -3.07294 -1.2993 -4.3231 -1.8508l0 15.9723c1.74779 0.6177 3 2.2846 3 4.2439 0 2.4853 -2.01472 4.5 -4.5 4.5S0.5 42.4853 0.5 40c0 -1.9593 1.25221 -3.6262 3 -4.2439l0 -17.3308c-0.3961 -0.1847 -0.76112 -0.3574 -1.09644 -0.518C1.20427 17.3327 0.515625 16.2023 0.515625 15c0 -1.2024 0.688645 -2.3328 1.887935 -2.9073 1.83832 -0.8807 4.5693 -2.12306 8.41954 -3.72734 5.3489 -2.22868 9.0147 -3.5545 10.9976 -4.23121Z"
            stroke-width="1"
          ></path>
          <path
            fill="#ffffff"
            d="M20.8516 28.1979c-3.8243 -1.3052 -7.6157 -2.752 -11.35114 -4.3207 -0.00031 0.0956 -0.00046 0.1921 -0.00046 0.2894 0 3.1423 0.16098 5.1542 0.32879 6.4007 0.19871 1.4758 1.05891 2.7724 2.41751 3.4834 1.9663 1.0291 5.7708 2.4492 11.7537 2.4492s9.7874 -1.4201 11.7537 -2.4492c1.3586 -0.711 2.2188 -2.0076 2.4175 -3.4834 0.1678 -1.2465 0.3288 -3.2584 0.3288 -6.4007 0 -0.0973 -0.0002 -0.1938 -0.0005 -0.2894 -3.7354 1.5687 -7.5268 3.0155 -11.3511 4.3207 -2.0451 0.6979 -4.2517 0.6979 -6.2968 0Z"
            stroke-width="1"
          ></path>
        </g>
      </g>
    </svg>
  );
};

const IconSkillFilled = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 48 48"
      id="Atom--Streamline-Plump"
      height="20"
      width="20"
    >
      <desc>Atom Streamline Icon: https://streamlinehq.com</desc>
      <g id="atom--science-atom">
        <path
          id="Union"
          fill="#ffffff"
          fill-rule="evenodd"
          d="M30.4678 5.8929c-0.8424 0.28764 -1.7062 0.64218 -2.5859 1.06023 2.4131 1.7276 4.8033 3.77557 7.0961 6.06837 2.2928 2.2927 4.3406 4.6828 6.0682 7.0958 0.418 -0.8796 0.7725 -1.7435 1.0602 -2.5858 1.551 -4.5423 1.0606 -8.05299 -1.2625 -10.37609s-5.8338 -2.8135 -10.3761 -1.26251Zm-1.2925 -3.78541c-1.6978 0.57969 -3.4322 1.37546 -5.1755 2.35896 -1.7434 -0.9835 -3.4778 -1.77927 -5.1755 -2.35896C13.5142 0.294336 8.15559 0.498613 4.32722 4.32698 0.498852 8.15535 0.294575 13.514 2.10773 18.824c0.57968 1.6977 1.37543 3.4321 2.35891 5.1754 -0.98359 1.7434 -1.77942 3.478 -2.35915 5.1759 -1.813154 5.31 -1.608877 10.6686 2.21949 14.497 3.82837 3.8284 9.18702 4.0326 14.49702 2.2195 1.6978 -0.5797 3.4324 -1.3755 5.1758 -2.3591 1.7433 0.9836 3.4779 1.7794 5.1757 2.3591 5.3101 1.8131 10.6687 1.6089 14.497 -2.2195 3.8284 -3.8284 4.0327 -9.187 2.2195 -14.497 -0.5797 -1.6979 -1.3755 -3.4325 -2.3591 -5.1759 0.9835 -1.7433 1.7792 -3.4777 2.3589 -5.1754 1.8131 -5.31 1.6089 -10.66865 -2.2195 -14.49702 -3.8284 -3.828367 -9.187 -4.032644 -14.497 -2.21949ZM5.89314 17.5315c0.28764 0.8423 0.64217 1.7062 1.0602 2.5858 1.72756 -2.413 3.77536 -4.8031 6.06816 -7.0958 2.2928 -2.2928 4.683 -4.34077 7.0961 -6.06837 -0.8797 -0.41805 -1.7435 -0.77259 -2.5859 -1.06023 -4.5423 -1.55099 -8.05295 -1.06059 -10.37605 1.26251S4.34214 12.9892 5.89314 17.5315Zm9.95676 -1.6816c-2.6879 2.6879 -4.9522 5.4525 -6.70548 8.1496 1.75338 2.6971 4.01768 5.4618 6.70568 8.1499 2.688 2.6879 5.4526 4.9522 8.1497 6.7055 2.697 -1.7533 5.4616 -4.0176 8.1496 -6.7055 2.688 -2.6881 4.9523 -5.4528 6.7057 -8.1499 -1.7533 -2.6971 -4.0176 -5.4617 -6.7055 -8.1496 -2.688 -2.688 -5.4527 -4.9523 -8.1498 -6.70568 -2.6972 1.75338 -5.4619 4.01768 -8.1499 6.70568Zm-9.957 14.6179c0.28768 -0.8425 0.64227 -1.7065 1.06039 -2.5862 1.72762 2.4131 3.77561 4.8033 6.06841 7.0962 2.2928 2.2928 4.6829 4.3406 7.096 6.0682 -0.8798 0.4181 -1.7437 0.7727 -2.5862 1.0604 -4.5423 1.551 -8.05299 1.0606 -10.37609 -1.2625s-2.8135 -5.8338 -1.26251 -10.3761ZM30.468 42.1064c-0.8424 -0.2877 -1.7064 -0.6423 -2.5861 -1.0604 2.413 -1.7276 4.8031 -3.7754 7.0959 -6.0682 2.2929 -2.2929 4.3408 -4.6831 6.0684 -7.0962 0.4181 0.8797 0.7727 1.7437 1.0604 2.5862 1.551 4.5423 1.0606 8.053 -1.2625 10.3761 -2.3231 2.3231 -5.8338 2.8135 -10.3761 1.2625ZM16.4998 23.9996c0 -4.1421 3.3578 -7.5 7.5 -7.5 4.1421 0 7.5 3.3579 7.5 7.5 0 4.1422 -3.3579 7.5 -7.5 7.5 -4.1422 0 -7.5 -3.3578 -7.5 -7.5Z"
          clip-rule="evenodd"
          stroke-width="1"
        ></path>
      </g>
    </svg>
  );
};

export default Sidebar;
