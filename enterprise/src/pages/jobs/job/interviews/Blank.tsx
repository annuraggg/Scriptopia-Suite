import { Play } from "lucide-react";

const Blank = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[92vh] w-full">
      <Play size={80} className=" opacity-50" />
      <p className="mt-5 opacity-50">Interviews is not enabled for this posting.</p>
    </div>
  );
};

export default Blank;
