import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

const Resume = () => {
  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem href="/resume">Resume</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
};

export default Resume;
