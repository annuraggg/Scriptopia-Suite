import { motion } from "framer-motion";
import { Button, CircularProgress } from "@nextui-org/react";
import { CircleCheck, CircleX } from "lucide-react";
import React, { useEffect } from "react";

const QualityGate = ({
  minimumFiveCases,
  minimumThreeSampleCases,
  minimumTwoTags,
  minimum100Words,
  completed,
}: {
  minimumFiveCases: boolean;
  minimumThreeSampleCases: boolean;
  minimumTwoTags: boolean;
  minimum100Words: boolean;
  completed: boolean[];
}) => {
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    console.log(completed)
    let total = 0;
    if (minimumFiveCases) total += 20;
    if (minimumThreeSampleCases) total += 20;
    if (minimumTwoTags) total += 20;
    if (minimum100Words) total += 20;
    if (completed.filter((i) => i).length === 3) total += 20;
    setValue(total);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className=""
  >
    <div className="flex items-center justify-center px-5 py-2 h-full flex-col gap-10">
      <h4>
        Quality Gate -{" "}
        <span className={`${value === 100 ? "text-success" : "text-danger"}`}>
          {value === 100 ? "Passed" : "Failed"}
        </span>
      </h4>

      <CircularProgress
        label="Quality Gate"
        classNames={{
          svg: "w-24 h-24 drop-shadow-md",
          value: "text-xl font-semibold text-white",
        }}
        value={value}
        color={value === 100 ? "success" : "danger"}
        showValueLabel={true}
      />

      <div className="flex gap-3 flex-col">
        <p className="flex items-center gap-5">
          {minimumFiveCases ? (
            <CircleCheck className="text-success" />
          ) : (
            <CircleX className="text-danger" />
          )}{" "}
          Atleast 5 cases required
        </p>
        <p className="flex items-center gap-5">
          {minimumThreeSampleCases ? (
            <CircleCheck className="text-success" />
          ) : (
            <CircleX className="text-danger" />
          )}{" "}
          Atleast 3 sample cases required
        </p>
        <p className="flex items-center gap-5">
          {minimumTwoTags ? (
            <CircleCheck className="text-success" />
          ) : (
            <CircleX className="text-danger" />
          )}{" "}
          Atleast 2 tags required
        </p>
        <p className="flex items-center gap-5">
          {minimum100Words ? (
            <CircleCheck className="text-success" />
          ) : (
            <CircleX className="text-danger" />
          )}
          Atleast 100 words required statement required
        </p>
        <p className="flex items-center gap-5">
          {completed.filter((i) => i).length === 3 ? (
            <CircleCheck className="text-success" />
          ) : (
            <CircleX className="text-danger" />
          )}
          All required fields are filled
        </p>
      </div>

      <Button
        color="success"
        variant="flat"
        disabled={value !== 100}
        aria-label="Submit"
      >
        Submit
      </Button>
    </div>
    </motion.div>
  );
};

export default QualityGate;
