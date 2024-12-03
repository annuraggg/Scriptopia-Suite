import React from 'react';
import { ChevronRight } from 'lucide-react';

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
      title: "Job Details",
    },
    {
      id: 2,
      title: "Additional Details",
    },
    {
      id: 3,
      title: "Workflow",
    },
    {
      id: 4,
      title: "Preview",
    },
  ];

  return (
    <div className="w-[20%] py-10 h-full">
      <div className="flex flex-col space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              flex items-center justify-between 
              px-4 py-3 
              rounded-lg 
              transition-all duration-300 ease-in-out 
              ${active === index 
                ? "bg-gray-600 bg-opacity-20 shadow-md" 
                : ""}
              ${active === index ? "opacity-100" : "opacity-60"}
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
                  ${active === index ? "bg-white" : "bg-gray-700"}
                `}
              ></div>
              <span className="text-white font-medium text-sm">
                {step.title}
              </span>
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