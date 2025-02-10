import { Spinner } from "@heroui/react";

const InProgress = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[92vh] w-full">
      <Spinner className=" opacity-50" />
      <p className="mt-5 opacity-50">
        ATS is running. It may take a while depending on the number of
        candidates.
      </p>
    </div>
  );
};

export default InProgress;
