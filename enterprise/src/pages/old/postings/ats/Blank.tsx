import { FileTextIcon } from "lucide-react";

const Blank = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[92vh] w-full">
      <FileTextIcon size={80} className=" opacity-50" />
      <p className="mt-5 opacity-50">ATS is not enabled for this posting.</p>
    </div>
  );
};

export default Blank;
