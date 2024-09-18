import {
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";
import { Drive } from "@shared-types/Drive";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const typeMap = {
  ca: "Coding Assessment",
  mcqca: "Multiple Choice and Coding Assessment",
  mcqa: "Multiple Choice Assessment",
};

const Configure = ({ drive }: { drive: Drive }) => {
  const navigate = useNavigate();
  const [assessmentTitles, setAssessmentTitles] = useState<string[]>([]);

  useEffect(() => {
    setAssessmentTitles(
      drive?.assessments?.map((assessment: any) => assessment.name) || []
    );
  }, [drive]);

  return (
    <div className="flex items-center justify-center h-[100vh] flex-col p-10">
      <p className="text-xl">
        Assessments are enabled but not configured for this drive
      </p>
      <p className="opacity-50 mt-2 mb-10">
        Please configure assessments for this drive by clicking on the configure
        button
      </p>

      {drive?.workflow?.steps?.map((step, index: number) => (
        <>
          {(step.type === "ca" ||
            step.type === "mcqca" ||
            step.type === "mcqa") && (
            <Card className="w-[50%] mt-3">
              <CardBody className="flex flex-row items-center justify-between">
                <div>
                  {step?.name}
                  <div className="text-sm opacity-50">
                    {typeMap[step?.type]}
                  </div>
                </div>
                {assessmentTitles.includes(step?.name) ? (
                  <div className="text-green-500">Configured</div>
                ) : (
                  <Button
                    variant="flat"
                    color="warning"
                    onClick={() => {
                      navigate(`new/${step.type}?step=${index}`);
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
