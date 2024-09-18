import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";

const TimerBar = () => {
  const [timer, setTimer] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      if (timer > 0) {
        const interval = setInterval(() => {
          secureLocalStorage.setItem("timer", timer.toString());
          setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
      } else if (timer === 0) {
        toast.info("Time's up!");
      }

      // remind at 1 minute
      if (timer === 60) {
        toast.info("1 minute remaining");
      }

      //remind at 5 minutes
      if (timer === 300) {
        toast.info("5 minutes remaining");
      }
    }
  }, [timer, loaded]);

  useEffect(() => {
    secureLocalStorage.getItem("timer") &&
      setTimer(parseInt(secureLocalStorage.getItem("timer") as string) - 2);

    setLoaded(true);
  }, []);

  const convertToTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex justify-center items-center w-full py-3 gap-3">
      <Clock /> {convertToTime(timer)} Remaining
    </div>
  );
};

export default TimerBar;
