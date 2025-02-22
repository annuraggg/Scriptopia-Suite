import { Button } from "@heroui/button";
import { GitBranch } from "lucide-react";

const Blank = ({
  setCreate,
}: {
  setCreate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[92vh] w-full">
      <GitBranch size={80} className=" opacity-50" />
      <p className="mt-5 opacity-50">
        Workflow is what steps you need to take to complete the Hiring Process
      </p>

      <Button className="mt-5 opacity-100" onClick={() => setCreate(true)}>Create Workflow</Button>
    </div>
  );
};

export default Blank;
