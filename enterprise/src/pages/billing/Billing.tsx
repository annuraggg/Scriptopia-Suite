import { RootState } from "@/@types/reducer";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NotSubscribed from "./NotSubscribed";
import Trial from "./Trial";
import Plan from "./Plan";

const Billing = () => {
  const org = useSelector((state: RootState) => state.organization);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [trialDays, setTrialDays] = useState<number | null>(10);
  const [renews, setRenews] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPlan("trial");
    setTrialDays(10);
    setRenews("2024-10-10");
  }, []);

  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem href={"/" + org._id}>Organization</BreadcrumbItem>
          <BreadcrumbItem href={"/" + org._id + "/billing"}>
            Billing
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      {currentPlan === "trial" && <Trial remainingTrialDays={trialDays} />}
      {currentPlan === "notSubscribed" && <NotSubscribed />}
      {currentPlan === "quaterly" && <Plan plan="quaterly" renews={renews} />}
      {currentPlan === "annual" && <Plan plan="annual" renews={renews} />}
    </>
  );
};

export default Billing;
