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

const Intro = () => {
  const steps = [
    {
      title: "Job Posting and Requisition Management",
      desc: "Effortlessly create and distribute job postings to multiple platforms.\n Track and manage job requisitions with ease.",
    },
    {
      title: "Application Collection",
      desc: "Collect applications from job boards, company websites, and direct submissions. \n Parse and store applicant information, resumes, and cover letters securely.",
    },
    {
      title: "Automated Resume Screening",
      desc: "Display a curated list of selected candidates for your review. \n Easily manage and track candidate progress.",
    },
    {
      title: "Assessments",
      desc: "Create tailored assessments including multiple-choice questions and coding challenges.\n Evaluate candidates' skills directly on our platform.",
    },
    {
      title: "Conduct interviews.",
      desc: "Schedule interviews, communicate with candidates, and gather feedback seamlessly.",
    },
  ];

  const features = [
    {
      name: "Job Posting and Requisition Management",
      icon: <Briefcase size={30} className="text-gray-500" />,
    },
    {
      name: "Application Collection",
      icon: <Inbox size={30} className="text-gray-500" />,
    },
    {
      name: "Automated Resume Screening",
      icon: <Filter size={30} className="text-gray-500" />,
    },
    {
      name: "Candidate Shortlisting",
      icon: <UserCheck size={30} className="text-gray-500" />,
    },
    {
      name: "Assessments",
      icon: <FileText size={30} className="text-gray-500" />,
    },
    {
      name: "Candidate Management",
      icon: <Users size={30} className="text-gray-500" />,
    },
    {
      name: "Communication and Collaboration",
      icon: <MessageCircle size={30} className="text-gray-500" />,
    },
    {
      name: "Advanced Security and Privacy",
      icon: <Shield size={30} className="text-gray-500" />,
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

  return (
    <div className="flex flex-col items-center p-5 h-screen">
      <div className="text-center mt-10">
        <h1 className="text-7xl font-poly drop-shadow-glow">
          Scriptopia Organizations
        </h1>
        <p className="mt-5 font-poly text-gray-300">
          Industry Grade Screening and Hiring ATS
        </p>
        <Button className="mt-10" variant="flat" color="success">
          Get Started
        </Button>
      </div>

      <div className="mt-5 font-poly">
        {steps.map((step, index) => (
          <div className=" p-5 rounded-lg flex justify-between mt-2 w-[60vw] ">
            <div className=" w-full">
              <p className="text-gray-500 text-xs">Step {index + 1}</p>
              <h5 className="text-gray-300 text-2xl">{step.title}</h5>
            </div>
            <p className="w-[50%] text-gray-400 text-sm">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 font-poly text-center">
        <h5>The Swiss Army Knife of Screening and Hiring</h5>
        <div className="flex flex-wrap justify-between mt-5">
          {features.map((feature) => (
            <div className="flex items-center gap-5 mt-5 border w-[49%] p-10 rounded-xl bg-gray-500 bg-opacity-5">
              {feature.icon}
              <p>{feature.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className=" mt-10 w-full">
        <h5 className="text-center">Pricing</h5>
        <p className="text-gray-500 text-xs text-center">
          Available as a Quaterly or Annual Subscription
        </p>
        <div className="flex justify-between mt-5 gap-5 w-full">
          {prices.map((price) => (
            <div className="border p-5 rounded-lg w-full bg-gray-500 bg-opacity-5 relative pb-20">
              <h5>{price.name}</h5>
              <h1 className="text-gray-300 mt-5 font-poly">
                ${price.monthly} <sub>/month</sub>
              </h1>

              <p className="text-gray-500 text-xs mt-5">
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

        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Intro;
