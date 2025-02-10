import { motion } from "framer-motion";
import { RootState } from "@/types/Reducer";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
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
    setCurrentPlan("quaterly");
    setTrialDays(10);
    setRenews("2024-10-10");
  }, []);

  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem>{org.name}</BreadcrumbItem>
          <BreadcrumbItem href={"/billing"}>Billing</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className=""
      >
        {currentPlan === "trial" && <Trial remainingTrialDays={trialDays} />}
        {currentPlan === "notSubscribed" && <NotSubscribed />}
        {currentPlan === "quaterly" && <Plan plan="quaterly" renews={renews} />}
        {currentPlan === "annual" && <Plan plan="annual" renews={renews} />}
      </motion.div>
    </>
  );
};

export default Billing;
