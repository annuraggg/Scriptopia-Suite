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
    <div className="w-[30%] py-10">
      <div className="flex flex-col gap-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center gap-5 py-3 ${
              active === index ? "opacity-70" : "opacity-30"
            } cursor-pointer`}
            onClick={() => setActive(index)}
          >
            <div className={`w-14 h-[3px] bg-white border rounded-xl`}></div>
            <div>{step.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
