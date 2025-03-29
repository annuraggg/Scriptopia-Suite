import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { ExtendedDrive } from "@shared-types/ExtendedDrive";
import { useOutletContext } from "react-router-dom";

const Main = () => {
  const { drive } = useOutletContext() as { drive: ExtendedDrive };

  return (
    <div className="p-10">
      <h3>Interviews</h3>
      {drive?.interviews?.map((interview) => (
        <Card key={interview._id} className="mt-5">
          <CardHeader>
            {
              drive?.workflow?.steps?.find(
                (step) => step._id === interview.workflowId
              )?.name
            }
            <div className="ml-5">
              {drive?.workflow?.steps?.find(
                (step) => step._id === interview.workflowId
              )?.status === "completed" && (
                <span className="text-green-500">Completed</span>
              )}{" "}
              {drive?.workflow?.steps?.find(
                (step) => step._id === interview.workflowId
              )?.status === "in-progress" && (
                <span className="text-yellow-500">Ongoing</span>
              )}{" "}
              {drive?.workflow?.steps?.find(
                (step) => step._id === interview.workflowId
              )?.status === "pending" && (
                <span className="text-blue-500">Pending</span>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {" "}
            {drive?.workflow?.steps?.find(
              (step) => step._id === interview.workflowId
            )?.status === "in-progress" && (
              <Button
                className="w-fit"
                color="success"
                variant="flat"
                onPress={() =>
                  window.open(
                    `${import.meta.env.VITE_MEET_URL}/v3/${interview.interview.code}?id=${drive._id}`
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
