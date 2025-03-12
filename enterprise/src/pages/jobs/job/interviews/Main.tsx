import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { ExtendedPosting } from "@shared-types/ExtendedPosting";
import { useOutletContext } from "react-router-dom";

const Main = () => {
  const { posting } = useOutletContext() as { posting: ExtendedPosting };

  return (
    <div className="p-10">
      <h3>Interviews</h3>
      {posting?.interviews?.map((interview) => (
        <Card key={interview._id} className="mt-5">
          <CardHeader>
            {
              posting?.workflow?.steps?.find(
                (step) => step._id === interview.workflowId
              )?.name
            }
            <div className="ml-5">
              {posting?.workflow?.steps?.find(
                (step) => step._id === interview.workflowId
              )?.status === "completed" && (
                <span className="text-green-500">Completed</span>
              )}{" "}
              {posting?.workflow?.steps?.find(
                (step) => step._id === interview.workflowId
              )?.status === "in-progress" && (
                <span className="text-yellow-500">Ongoing</span>
              )}{" "}
              {posting?.workflow?.steps?.find(
                (step) => step._id === interview.workflowId
              )?.status === "pending" && (
                <span className="text-blue-500">Pending</span>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {" "}
            {posting?.workflow?.steps?.find(
              (step) => step._id === interview.workflowId
            )?.status === "in-progress" && (
              <Button
                className="w-fit"
                color="success"
                variant="flat"
                onPress={() =>
                  window.open(
                    `${import.meta.env.VITE_MEET_URL}/v3/${interview.interview.code}?id=${posting._id}`
                  )
                }
              >
                Join
              </Button>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default Main;
