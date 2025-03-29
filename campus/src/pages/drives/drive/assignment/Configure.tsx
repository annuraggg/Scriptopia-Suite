import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Assignment } from "@shared-types/Drive";
import { Drive } from "@shared-types/Drive";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Configure = ({ drive }: { drive: Drive }) => {
  const navigate = useNavigate();
  const [assignmentTitles, setAssignmentTitles] = useState<string[]>([]);

  useEffect(() => {
    setAssignmentTitles(
      drive?.assignments?.map((assignment: Assignment) => assignment.name) ||
        []
    );
  }, [drive]);

  return (
    <div className="flex items-center justify-center h-[100vh] flex-col p-10">
      <p className="text-xl">
        Assignments are enabled but not configured for this drive
      </p>
      <p className="opacity-50 mt-2 mb-10">
        Please configure assignments for this drive by clicking on the
        configure button
      </p>

      {drive?.workflow?.steps?.map((step, index: number) => (
        <>
          {step.type === "ASSIGNMENT" && (
            <Card className="w-[50%] mt-3">
              <CardBody className="flex flex-row items-center justify-between">
                <div>
                  {step?.name}
                  <div className="text-sm opacity-50">Assignment</div>
                </div>
                {assignmentTitles.includes(step?.name) ? (
                  <div className="text-green-500">Configured</div>
                ) : (
                  <Button
                    variant="flat"
                    color="warning"
                    onClick={() => {
                      navigate(`new/?step=${index}`, {
                        state: { step: index },
                      });
                    }}
                  >
                    Configure
                  </Button>
                )}
              </CardBody>
            </Card>
          )}
        </>
      ))}
    </div>
  );
};

export default Configure;
