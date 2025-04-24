import { Spinner } from "@heroui/react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-[100vh] w-[100vw] absolute top-0 left-0 loader z-50">
      <Spinner color="danger" />
    </div>
  );
};

export default Loader;
