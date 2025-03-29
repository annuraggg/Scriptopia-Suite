import Squares from "@/components/ui/Squares";
import { Spinner } from "@nextui-org/react";

const Loading = () => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="black"
          hoverFillColor="#222"
        />
      </div>
      <div className="z-50 flex flex-col items-center justify-center gap-3 backdrop-blur w-48 h-48 rounded-full ">
        <Spinner />
        <p>Please Wait</p>
      </div>
    </div>
  );
};

export default Loading;
