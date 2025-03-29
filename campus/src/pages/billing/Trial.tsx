import { AlertCircleIcon } from "lucide-react";
import { Button } from "@nextui-org/react";
import {
  Briefcase,
  FileText,
  Filter,
  Inbox,
  MessageCircle,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";

const features = [
  {
    name: "Drive and Requisition Management",
    icon: <Briefcase size={30} className="" />,
  },
  {
    name: "Application Collection",
    icon: <Inbox size={30} className="" />,
  },
  {
    name: "Automated Resume Screening",
    icon: <Filter size={30} className="" />,
  },
  {
    name: "Candidate Shortlisting",
    icon: <UserCheck size={30} className="" />,
  },
  {
    name: "Assessments",
    icon: <FileText size={30} className="" />,
  },
  {
    name: "Candidate Management",
    icon: <Users size={30} className="" />,
  },
  {
    name: "Enhanced Communication",
    icon: <MessageCircle size={30} className="" />,
  },
  {
    name: "Advanced Security and Privacy",
    icon: <Shield size={30} className="" />,
  },
];

const prices = [
  { name: "Quaterly", price: 24.99, monthly: 8.33 },
  {
    name: "Annual",
    price: 59.99,
    monthly: 4.99,
    desc: "Save 40% with an annual subscription",
  },
];

const Trial = ({ remainingTrialDays = 0 }: { remainingTrialDays: number | null }) => {
  return (
    <div className="p-5">
      <div className="flex gap-3 border rounded-xl px-5 py-3">
        <AlertCircleIcon size={24} />
        <p>You are on a free trial.</p>
        <p className="">
          {remainingTrialDays} days remaining
        </p>
      </div>

      <p className="opacity-50 mt-5 text-center">
        Subscribe to a plan before the trial ends to continue using the
        platform.
      </p>

      <p className=" text-sm text-center">
        Available as a Quaterly or Annual Subscription
      </p>
      <div className="flex justify-between mt-5 gap-5 w-full">
        {prices.map((price) => (
          <div className="border p-5 rounded-lg w-full bg-opacity-5 relative pb-20">
            <h5>{price.name}</h5>
            <h1 className="mt-5 font-poly">
              ${price.monthly} <sub>/month</sub>
            </h1>

            <p className=" text-xs mt-5">
              Billed ${price.price} {price.name}
            </p>

            {price.desc && (
              <p className="text-xs text-warning mt-2">{price.desc}</p>
            )}
            <Button
              className="mt-5 float-right absolute right-5 bottom-5"
              variant="flat"
              color="success"
            >
              Subscribe
            </Button>
          </div>
        ))}
      </div>

      <p className=" text-sm text-center mt-5">
        All Plans include the following features
      </p>
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {features.map((feature) => (
          <div className="flex gap-3 items-center border py-5 px-3 bg-card rounded-xl w-[48%]">
            {feature.icon}
            <p>{feature.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trial;
