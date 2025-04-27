import { Spinner } from "@nextui-org/react";
import { useState, useEffect } from "react";

interface LoaderProps {
  text?: string[];
  interval?: number;
}

const Loader = ({ text, interval = 3000 }: LoaderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text || text.length <= 1) return;

    const textInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < text.length - 1) {
          return prevIndex + 1;
        }

        return prevIndex;
      });
    }, interval);

    return () => clearInterval(textInterval);
  }, [text, interval]);

  return (
    <div className="flex flex-col items-center justify-center h-[100vh] z-50">
      <Spinner color="danger" />
      {text && text.length > 0 && (
        <p className="mt-4 text-center text-gray-600">{text[currentIndex]}</p>
      )}
    </div>
  );
};

export default Loader;
