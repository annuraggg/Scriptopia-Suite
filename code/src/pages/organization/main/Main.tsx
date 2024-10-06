import { OrganizationProfile } from "@clerk/clerk-react";

const Main = () => {
  return (
    <div className="flex flex-col items-center h-screen">
      <OrganizationProfile routing="hash" />
    </div>
  );
};

export default Main;
