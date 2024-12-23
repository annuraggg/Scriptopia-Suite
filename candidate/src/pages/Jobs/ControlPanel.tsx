import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

const ControlPanel = () => {
  return (
    <div className="mt-5 ml-5">
      <Breadcrumbs>
        <BreadcrumbItem href="/jobs">Jobs</BreadcrumbItem>
        <BreadcrumbItem href="/jobs">Control Panel</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  )
}

export default ControlPanel