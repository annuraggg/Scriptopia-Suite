const Sidebar = ({
  completed = [],
  steps,
  activeStep,
  setActiveStep,
}: {
  completed: boolean[];
  steps: { title: string; description: string }[];
  activeStep: number;
  setActiveStep: (value: number) => void;
}) => {
  return (
    <div>
      <div className="flex flex-col gap-3 items-start justify-around h-[calc(100%-10px)] w-full">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex gap-10 items-center bg-inherit justify-start px-5 border transition-all duration-200 w-[270px] h-full cursor-pointer rounded-lg border-l-8          
              ${activeStep === index + 1 && "bg-card-foreground scale-105"}
              ${
                completed[index]
                  ? "border-l-green-500"
                  : activeStep > index + 1
                  ? "border-l-red-500"
                  : activeStep === index + 1
                  ? "bg-card-foreground scale-105 border-l-yellow-500"
                  : "bg-card"
              }
    
              `}
            onClick={() => {
              setActiveStep(index + 1);
            }}
          >
            <div className="flex gap-5 items-center justify-center ">
              <div className="min-h-10 min-w-10 flex items-center justify-center rounded-full border ">
                {index + 1}
              </div>
              <div className="w-full">
                <div className="text-xs text-gray-400">{step.title}</div>
                <div className="text-md mt-2">{step.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
