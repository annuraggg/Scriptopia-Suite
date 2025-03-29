import { Spinner } from "@heroui/spinner";

const InProgress = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[92vh] w-full">
      <Spinner />
      <p className="mt-5">
        ATS is running. It may take a while depending on the number of
        candidates.
      </p>
    </div>
  );
};

export default InProgress;
