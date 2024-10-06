
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { CircularProgress } from "@nextui-org/progress";
import { Button } from "@nextui-org/react";

const Timer = () => {
  return (
    <Card className="px-10 w-full h-64 hidden md:block">
      <CardHeader className="flex items-center justify-center">
        Focus Timer
      </CardHeader>
      <CardBody className="flex items-center justify-center">
        <CircularProgress
          value={50}
          showValueLabel
          formatOptions={{ style: "unit", unit: "minute" }}
          classNames={{
            svg: "w-28 h-28 drop-shadow-md",
            value: "text-md font-semibold text-white",
          }}
        />
      </CardBody>
      <CardFooter className="flex items-center justify-center">
        <Button>Start</Button>
      </CardFooter>
    </Card>
  );
};

export default Timer;