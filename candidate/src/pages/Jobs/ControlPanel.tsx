import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

const ControlPanel = () => {
  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
        <BreadcrumbItem href="/profile">General</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  )
}

export default ControlPanel