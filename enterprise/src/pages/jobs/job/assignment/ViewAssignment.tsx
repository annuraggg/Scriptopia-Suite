import { Card, CardBody, CardHeader, Tabs, Tab } from "@heroui/react";
import { Assignment, Posting } from "@shared-types/Posting";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import DataTable from "./DataTable";
import { Candidate } from "@shared-types/Candidate";

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
        assignment.submissions.map((sub) => {
          const currentPosting = (
            sub as unknown as Candidate
          ).appliedPostings.find((p) => p.postingId === posting._id);
          const currentAssignment = currentPosting?.scores?.as?.find(
            (a) => a?.asId === assignment._id
          );
          if (currentAssignment) {
            // @ts-expect-error - Object has no properties common
            sub.grade = currentAssignment.score; // @ts-expect-error - Object has no properties common
            sub.submittedOn = new Date(currentAssignment.submittedOn).toLocaleString(); // @ts-expect-error - Object has no properties common
            sub.status = currentPosting.status;
          }
        });
        setAssignment(assignment);
      }
    }

    console.log(posting);
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
            data={assignment.submissions}
            postingId={posting._id!}
            assignmentId={assignment._id!}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ViewAssignment;
