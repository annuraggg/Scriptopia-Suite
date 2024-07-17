import { Building2, Users } from "lucide-react";

const Sidebar = ({
  active,
  setActive,
}: {
  active: string;
  setActive: (active: string) => void;
}) => {
  const items = [
    { title: "General", icon: <Building2 /> },
    { title: "Members", icon: <Users /> },
  ];

  return (
    <div className="border p-5 w-[15%] h-cover">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-center gap-5 p-3 hover:text-gray-300 duration-300 transition-colors cursor-pointer rounded-lg text-sm ${
            active === item.title && "bg-gray-800 text-gray-300"
          }`}
          onClick={() => setActive(item.title)}
        >
          {item.icon} {item.title}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
