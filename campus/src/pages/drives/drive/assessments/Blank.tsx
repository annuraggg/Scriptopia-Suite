import { BarChart } from "lucide-react";

const Blank = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[92vh] w-full">
      <BarChart size={80} className=" opacity-50" />
      <p className="mt-5 opacity-50">
        Assessment not enabled for this Drive
      </p>
    </div>
  );
};

export default Blank;
