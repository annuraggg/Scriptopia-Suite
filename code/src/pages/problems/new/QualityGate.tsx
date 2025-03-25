import { motion } from "framer-motion";
import { Button, CircularProgress } from "@heroui/react";
import { CircleCheck, CircleX } from "lucide-react";
import React, { useEffect } from "react";

const QualityGate = ({
  minimumFiveCases,
  minimumThreeSampleCases,
  minimumTwoTags,
  minimum100Words,
  completed,
  buildRequestData,
  loading,
}: {
  minimumFiveCases: boolean;
  minimumThreeSampleCases: boolean;
  minimumTwoTags: boolean;
  minimum100Words: boolean;
  completed: boolean[];
  buildRequestData: () => Promise<void>;
  loading: boolean;
}) => {
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    let total = 0;
    if (minimumFiveCases) total += 20;
    if (minimumThreeSampleCases) total += 20;
    if (minimumTwoTags) total += 20;
    if (minimum100Words) total += 20;
    if (completed.filter((i) => i).length === 3) total += 20;
    setValue(total);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickHandle = async () => {
    await buildRequestData();
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className=""
    >
      <div className="flex items-center justify-center px-5 py-2 h-full flex-col gap-7">
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
            value: "text-xl font-semibold text-foreground",
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

        {value !== 100 && (
          <p className="text-danger">
            A Quality Gate Scroll of 100 is required to submit the problem
          </p>
        )}

        <Button
          color="success"
          variant="flat"
          isDisabled={value !== 100}
          aria-label="Submit"
          onClick={onClickHandle}
          isLoading={loading}
        >
          Submit
        </Button>
      </div>
    </motion.div>
  );
};

export default QualityGate;
