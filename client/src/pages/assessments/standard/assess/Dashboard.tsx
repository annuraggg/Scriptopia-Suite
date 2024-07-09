import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Main from "./MainWindow";

const Lander = () => {
  const [timer, setTimer] = useState(3600);
  const [progress] = useState({
    overall: 30,
    mcq: 40,
    code: 20,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-5 items-center justify-center p-5 h-screen">
      <Sidebar timer={timer} progress={progress} />
      <Main />
    </div>
  );
};

export default Lander;
