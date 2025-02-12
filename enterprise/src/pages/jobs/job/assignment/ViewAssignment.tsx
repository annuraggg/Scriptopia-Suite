import { Assignment, Posting } from "@shared-types/Posting";
import { AppliedPosting } from "@shared-types/AppliedPosting";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import DataTable from "./DataTable";
import { Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";

const ViewAssignment = () => {
  const { posting } = useOutletContext() as { posting: Posting };
  const [assignment, setAssignment] = useState<Assignment>({} as Assignment);

  useEffect(() => {
    if (posting) {
      const assignmentId = window.location.pathname.split("/").pop();
      const assignment = posting?.assignments?.find(
        (a) => a._id === assignmentId
      );
      if (assignment) {
        assignment?.submissions?.forEach((submissionId) => {
          const appliedPosting = posting.candidates?.find(
            (ap) => (ap as unknown as AppliedPosting).posting === posting._id
          );

          if (appliedPosting) {
            const currentAssignmentScore = (
              appliedPosting as unknown as AppliedPosting
            ).scores?.find((score) => score.stageId === assignment._id);
            if (currentAssignmentScore) {
              // Updating submission details
              (submissionId as any).grade = currentAssignmentScore.score;
            }
          }
        });
        setAssignment(assignment);
      }
    }
  }, [posting]);

  return (
    <div className="p-5">
      <p>Assignment</p>
      <Tabs className="mt-5" variant="light">
        <Tab title="Overview">
          <Card>
            <CardHeader className="text-xl">{posting.title}</CardHeader>
            <CardBody>{assignment.description}</CardBody>
          </Card>
        </Tab>

        <Tab title="Submissions">
          <DataTable
            data={assignment.submissions || []}
            postingId={posting._id!}
            assignmentId={assignment._id!}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ViewAssignment;
