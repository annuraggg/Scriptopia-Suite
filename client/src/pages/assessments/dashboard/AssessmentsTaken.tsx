import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";

const AssessmentsTaken = () => {
  const assessments = [
    {
      name: "Assessment 1",
      date: "12/12/2021",
      duration: 60,
    },

    {
      name: "Assessment 2",
      date: "12/12/2021",
      duration: 60,
    },

    {
      name: "Assessment 3",
      date: "12/12/2021",
      duration: 60,
    },
  ];
  return (
    <div className="w-full p-10 h-[90vh]">
      <div>
        <Input placeholder="Search Assessments" />
      </div>
      <div className="mt-5 flex gap-5 flex-wrap">
        {assessments.map((assessment) => (
          <Card className="w-[32%]">
            <CardHeader>{assessment.name}</CardHeader>
            <CardBody>
              <p className="text-xs text-gray-500">Date: {assessment.date}</p>
              <p className="text-xs text-gray-500">
                Duration: {assessment.duration} minutes
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssessmentsTaken;
