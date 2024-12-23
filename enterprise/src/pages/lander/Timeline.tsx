import { Timeline as TimelineComponent } from "@/components/ui/timeline";

export function Timeline() {
  const steps = [
    {
      title: "Job Posting and Requisition Management",
      content:
        "Effortlessly create and distribute job postings to multiple platforms.\n Track and manage job requisitions with ease.",
    },
    {
      title: "Application Collection",
      content:
        "Collect applications from job boards, company websites, and direct submissions. \n Parse and store applicant information, resumes, and cover letters securely.",
    },
    {
      title: "Automated Resume Screening",
      content:
        "Display a curated list of selected candidates for your review. \n Easily manage and track candidate progress.",
    },
    {
      title: "Assessments",
      content:
        "Create tailored assessments including multiple-choice questions and coding challenges.\n Evaluate candidates' skills directly on our platform.",
    },
    {
      title: "Conduct interviews.",
      content:
        "Schedule interviews, communicate with candidates, and gather feedback seamlessly.",
    },
  ];

  return (
    <div className="w-full">
      <TimelineComponent data={steps} />
    </div>
  );
}
