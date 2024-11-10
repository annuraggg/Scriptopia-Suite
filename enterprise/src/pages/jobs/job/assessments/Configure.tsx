import { Button, Card, CardBody } from "@nextui-org/react";
import { Posting } from "@shared-types/Posting";
import { useEffect, useState } from "react";

const typeMap = {
  ca: "Coding Assessment",
  mcqca: "Multiple Choice and Coding Assessment",
  mcqa: "Multiple Choice Assessment",
};

const codeStepMap: { [key: string]: string } = {
  ca: "code",
  mcqca: "mcq_coding",
  mcqa: "mcq",
  rs: "rs",
  as: "as",
  pi: "pi",
  cu: "cu",
};

const Configure = ({ posting }: { posting: Posting }) => {
  const [assessmentTitles, setAssessmentTitles] = useState<string[]>([]);

  useEffect(() => {
    setAssessmentTitles(
      posting?.assessments?.map((assessment) => assessment.assessmentId) || []
    );
  }, [posting]);

  return (
    <div className="flex items-center justify-center h-[100vh] flex-col p-10">
      <p className="text-xl">
        Assessments are enabled but not configured for this posting
      </p>
      <p className="opacity-50 mt-2 mb-10">
        Please configure assessments for this posting by clicking on the
        configure button
      </p>

      {posting?.workflow?.steps?.map(
        (step, index: number) =>
          (step.type === "ca" ||
            step.type === "mcqca" ||
            step.type === "mcqa") && (
            <Card className="w-[50%] mt-3" key={step._id}>
              <CardBody className="flex flex-row items-center justify-between">
                <div>
                  {step?.name}
                  <div className="text-sm opacity-50">
                    {typeMap[step?.type]}
                  </div>
                </div>
                {assessmentTitles.includes(step?.stepId) ? (
                  <div className="text-green-500">Configured</div>
                ) : (
                  <Button
                    variant="flat"
                    color="warning"
                    onClick={() => {
                      window.location.href = `${
                        import.meta.env.VITE_CODE_URL
                      }/assessments/new/${
                        codeStepMap[step.type]
                      }?isPosting=true&postingId=${
                        posting._id
                      }&step=${index}&returnUrl=${window.location.href}`;
                    }}
                  >
                    Configure
                  </Button>
                )}
              </CardBody>
            </Card>
          )
      )}
    </div>
  );
};

export default Configure;
