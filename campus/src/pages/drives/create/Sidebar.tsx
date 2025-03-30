import { ChevronRight } from "lucide-react";

const Sidebar = ({
  active = 0,
  setActive,
}: {
  active: number;
  setActive: (value: number) => void;
}) => {
  const steps = [
    {
      id: 1,
      title: "Drive Details",
    },
    {
      id: 2,
      title: "Additional Details",
    },
    {
      id: 3,
      title: "Access",
    },
    {
      id: 4,
      title: "Workflow",
    },
    {
      id: 5,
      title: "Preview",
    },
  ];

  return (
    <div className="w-[30%] py-10 h-full">
      <div className="flex flex-col space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              flex items-center justify-between 
              px-4 py-3 
              rounded-lg 
              transition-all duration-300 ease-in-out 
              ${
                active === index
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground"
              }
              cursor-pointer group
            `}
            onClick={() => setActive(index)}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`
                  w-10 h-1 
                  rounded-full 
                  transition-all duration-300 
                  ${active === index ? "bg-background" : "bg-foreground"}
                `}
              ></div>
              <span className={`font-medium text-sm w-full`}>{step.title}</span>
            </div>
            <ChevronRight
              className={`
                text-white 
                opacity-0 group-hover:opacity-100 
                transition-opacity duration-300
                ${active === index ? "opacity-100" : ""}
              `}
              size={20}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
