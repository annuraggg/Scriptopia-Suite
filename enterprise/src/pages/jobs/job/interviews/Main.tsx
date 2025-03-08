import { Card, CardHeader } from "@heroui/card";
import { ExtendedPosting } from "@shared-types/ExtendedPosting";
import { useOutletContext } from "react-router-dom";

const Main = () => {
  const { posting } = useOutletContext() as { posting: ExtendedPosting };

  return (
    <div className="p-10">
      <h3>Interviews</h3>
      {posting?.interviews?.map((interview) => (
        <Card key={interview._id}>
          <CardHeader>
            {posting?.workflow?.steps?.find(step => step._id === interview.workflowId)?.name}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default Main;
