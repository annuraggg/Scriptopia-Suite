import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

const Home = () => {
  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard">Home</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
};

export default Home;
