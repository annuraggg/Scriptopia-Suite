import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Posting } from "@shared-types/Posting";
import { ChevronRight } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";

const Main = () => {
  const { posting } = useOutletContext() as { posting: Posting };
  const navigate = useNavigate();

  return (
    <div className="p-5">
      <p>Assignments</p>
      <div>
        {posting.assignments.map((assignment) => (
          <Card
            key={assignment._id}
            className="mt-5 w-full"
            isPressable
            onClick={() => navigate(`${assignment._id}`)}
          >
            <CardHeader className="text-xl">{assignment.name}</CardHeader>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p>{assignment.description}</p>
                  <p>Submissions: {assignment.submissions.length}</p>
                </div>
                <ChevronRight size={24} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Main;
