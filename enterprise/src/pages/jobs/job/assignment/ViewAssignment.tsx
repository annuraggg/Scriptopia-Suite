import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Input,
  Button,
} from "@nextui-org/react";
import { Candidate } from "@shared-types/Candidate";
import { Assignment, Posting } from "@shared-types/Posting";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

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
        setAssignment(assignment);
      }
    }

    console.log(posting);
  }, [posting]);

  const download = () => {
    console.log("Downloading...");
  };

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
          <Card>
            <Card>
              <CardHeader>Submissions</CardHeader>
              <CardBody>
                {/* @ts-expect-error - TS doesn't know the shape of Candidate */}
                {assignment.submissions?.map((submission: Candidate) => (
                  <div
                    key={submission._id}
                    className="flex justify-between items-center p-2 rounded-xl"
                  >
                    <p>{submission.firstName + " " + submission.lastName}</p>
                    <p>{submission.email}</p>
                    <Button onClick={download}>
                      <Download size={20} />
                      <p>Download</p>
                    </Button>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Grade"
                        type="number"
                        onChange={(e) => console.log(e.target.value)}
                        className="w-[100px]"
                      />
                      <Button variant="flat" color="success">
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ViewAssignment;
