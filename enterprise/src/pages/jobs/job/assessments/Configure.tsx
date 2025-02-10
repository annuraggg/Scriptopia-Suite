import { Button } from "@heroui/react";
import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import type { Posting, WorkflowStep } from "@shared-types/Posting";

const ASSESSMENT_TYPES = {
  CODING_ASSESSMENT: "Coding Assessment",
  MCQ_ASSESSMENT: "Multiple Choice Assessment",
} as const;

const STEP_TYPE_MAP = {
  CODING_ASSESSMENT: "code",
  MCQ_ASSESSMENT: "mcq",
} as const;

interface ConfigureProps {
  posting: Posting;
}

const Configure = ({ posting }: ConfigureProps) => {
  const [configuredAssessments, setConfiguredAssessments] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    const configuredIds = new Set([
      ...(posting?.codeAssessments?.map((a) => a.workflowId) || []),
      ...(posting?.mcqAssessments?.map((a) => a.workflowId) || []),
    ]);

    setConfiguredAssessments(configuredIds);
  }, [posting]);

  const handleConfigure = (step: WorkflowStep, index: number): void => {
    const baseUrl = import.meta.env.VITE_CODE_URL;
    const params = new URLSearchParams({
      isPosting: "true",
      postingId: posting._id || "",
      step: index.toString(),
      returnUrl: window.location.href,
    });

    window.location.href = `${baseUrl}/assessments/new/${
      STEP_TYPE_MAP[step.type as keyof typeof STEP_TYPE_MAP]
    }?${params}`;
  };

  const isAssessmentStep = (step: WorkflowStep): boolean =>
    step.type === "CODING_ASSESSMENT" || step.type === "MCQ_ASSESSMENT";

  return (
    <div className="flex items-center justify-center h-screen flex-col p-10">
      <p className="text-xl">
        Assessments are enabled but not configured for this posting
      </p>
      <p className="text-muted-foreground mt-2 mb-10">
        Please configure assessments for this posting by clicking on the
        configure button
      </p>

      <div className="w-full max-w-2xl space-y-3">
        {posting?.workflow?.steps
          ?.filter(isAssessmentStep)
          .map((step, index) => (
            <Card key={step._id}>
              <CardBody className="flex flex-row items-center justify-between p-6">
                <div>
                  <div>{step.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {
                      ASSESSMENT_TYPES[
                        step.type as keyof typeof ASSESSMENT_TYPES
                      ]
                    }
                  </div>
                </div>

                {configuredAssessments.has(step._id || "") ? (
                  <div className="text-green-500">Configured</div>
                ) : (
                  <Button onPress={() => handleConfigure(step, index)}>
                    Configure
                  </Button>
                )}
              </CardBody>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Configure;
