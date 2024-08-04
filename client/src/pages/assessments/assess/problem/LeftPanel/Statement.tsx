import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import Quill from "quill";
import { Delta } from "quill/core";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";
import { Clock } from "lucide-react";

const Statement = ({
  statement,
  title,
}: {
  statement: Delta;
  title: string;
}) => {
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
    setTimeout(() => {
      const quill = new Quill("#editor-div", {
        readOnly: true,
        theme: "bubble",
        modules: {
          toolbar: false,
        },
      });
      quill.setContents(statement);
      setLoaded(true);
    }, 100);

    secureLocalStorage.getItem("timer") &&
      setTimer(parseInt(secureLocalStorage.getItem("timer") as string) - 2);
  }, [statement]);

  const convertToTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="w-full h-full">
      <Card className="w-full h-full">
        <div className="flex justify-between px-5 pt-5">
          <p>Statement</p>
          <div className="flex gap-3">
            <Clock />
            <div>{convertToTime(timer)}</div>
          </div>
        </div>
        <h6 className="px-5 mt-3">{title}</h6>
        <CardBody className="h-[79.5vh]">
          <div id="editor-div" className="w-full overflow-auto -mt-10"></div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Statement;
