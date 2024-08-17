import { HardDrive, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const tabs = [
    { icon: Terminal, label: "Audit Logs", link: "audit-logs" },
    { icon: HardDrive, label: "Data", link: "data" },
  ];

  return (
    <div className="h-[85vh] border min-w-[20%] rounded-xl bg-card px-2">
      <div className="flex flex-col gap-2 mt-5">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            className="flex gap-3 px-3 py-2 rounded-xl hover:bg-gray-800 cursor-pointer transition-all"
            onClick={() => navigate(`/settings/security/${tab.link}`)}
          >
            <tab.icon />
            <p>{tab.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
