import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Filter,
  Inbox,
  UserCheck,
  Users,
} from "lucide-react";
import {
  Button,
  Image,
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const Lander = () => {
  const navigate = useNavigate();

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
      desc: "Easily create and manage job postings across multiple channels. Our intuitive interface allows you to track requisitions effortlessly and ensure that your roles are filled with the best talent.",
    },
    {
      name: "Application Collection",
      icon: <Inbox size={30} className="text-gray-500" />,
      desc: "Gather and organize applications seamlessly. Our platform centralizes all incoming applications in one place, making it easy to review and manage candidate submissions",
    },
    {
      name: "Automated Resume Screening",
      icon: <Filter size={30} className="text-gray-500" />,
      desc: "Save time and increase efficiency with our automated resume screening tools. Our smart algorithms filter and rank resumes based on your criteria, so you can focus on the most qualified candidates.",
    },
    {
      name: "Candidate Shortlisting",
      icon: <UserCheck size={30} className="text-gray-500" />,
      desc: "Streamline your shortlisting process with automated recommendations. Quickly identify top candidates with our advanced analytics and make informed decisions faster.",
    },
    {
      name: "Assessments",
      icon: <FileText size={30} className="text-gray-500" />,
      desc: "Evaluate candidates with precision using customizable assessments. From skills tests to personality evaluations, our tools help you gain deeper insights into each candidate’s fit for your organization.",
    },
    {
      name: "Candidate Management",
      icon: <Users size={30} className="text-gray-500" />,
      desc: "Keep track of all candidate interactions and stages in one place. Our robust management features ensure you stay organized and maintain a smooth candidate experience from application to offer.",
    },
    // {
    //   name: "Enhanced Communication",
    //   icon: <MessageCircle size={30} className="text-gray-500" />,
    // },
    // {
    //   name: "Advanced Security and Privacy",
    //   icon: <Shield size={30} className="text-gray-500" />,
    // },
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

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <>
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2.0 }}
        className=""
      >
        <div className="py-10 mx-20">
          <div>
            <img
              src="/logo.png"
              alt="logo"
              className="w-10 h-10"
            />
          </div>
          <div className="flex max-w-[100vw] h-[95vh] items-center">
            <div className="flex flex-col h-full mt-48">
              <h1 className="text-7xl max-w-[50vw] pr-20 font-poly drop-shadow-glow">
                Industry Grade Screening and Hiring Platform
              </h1>
              <p className="mt-5 opacity-50">
                Empower your team to hire the best candidates
              </p>
              <div className="flex flex-row gap-5 mt-5 w-[30vw]">
                <Button
                  className="w-full"
                  color="primary"
                  variant="flat"
                  onClick={scrollDown}
                >
                  Learn More
                </Button>
                <Button
                  onClick={() => navigate("/start")}
                  className="w-full"
                  color="success"
                  variant="shadow"
                >
                  Get Started
                </Button>
              </div>
            </div>
            <div className="relative max-w-[50vw] h-full">
              <div
                className="absolute top-0 left-0 transition-all duration-300 ease-in-out hover:z-10"
              >
                <Image
                  src="/lander2.png"
                  alt="Hiring"
                  className="border min-w-[40vw] min-h-[100%] drop-shadow-glow-dark"
                />
              </div>
              <div
                className="absolute top-10 -left-10 transition-all duration-300 ease-in-out z-0 hover:z-0"
              >
                <Image
                  src="/lander1.png"
                  alt="Hiring"
                  className="border min-w-[40vw] min-h-[100%] drop-shadow-glow-dark"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h2>The Swiss Army Knife for Screening and Hiring</h2>
            <div className="flex flex-wrap gap-5 mt-5 w-[80vw]">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`w-[32%] gap-20 px-10 mt-5 border p-5 rounded-xl bg-card drop-shadow-glow-light-dark`}
                >
                  {feature.icon}
                  <div className="text-2xl font-bold mt-5">{feature.name}</div>
                  <div className="opacity-50 mt-3">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-10 h-full">
            <h2>How it Works</h2>
            <div className="flex h-full gap-20 w-[50%]">
              <div className="min-h-max bg-white drop-shadow-glow w-1 rounded-xl mt-16 overflow-visible relative">
                <div className="rounded-full bg-white h-6 w-6 absolute top-0 left-0 -translate-x-[11px] translate-y-[0px] drop-shadow-glow"></div>
                <div className="rounded-full bg-white h-6 w-6 absolute top-0 left-0 -translate-x-[11px] translate-y-[195px] drop-shadow-glow"></div>
                <div className="rounded-full bg-white h-6 w-6 absolute top-0 left-0 -translate-x-[11px] translate-y-[390px] drop-shadow-glow"></div>
                <div className="rounded-full bg-white h-6 w-6 absolute top-0 left-0 -translate-x-[11px] translate-y-[585px] drop-shadow-glow"></div>
                <div className="rounded-full bg-white h-6 w-6 absolute top-0 left-0 -translate-x-[11px] translate-y-[780px] drop-shadow-glow"></div>
              </div>
              <div className="flex flex-wrap gap-5 mt-5 w-[80vw]">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`w-[100%] gap-20 px-10 mt-10 drop-shadow-glow-light-dark h-[18vh]`}
                  >
                    <div className="text-2xl font-bold">{step.title}</div>
                    <div className="opacity-50 mt-3">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-10 h-full">
            <h2>Pricing</h2>
            <p className="opacity-50 text-sm">
              Available as a Quaterly or Annual Subscription
            </p>
            <div className="flex h-full gap-20 w-full items-center justify-center">
              <div className="flex gap-5 mt-5 w-[80vw]">
                {prices.map((price, index) => (
                  <Card className="w-full" key={index}>
                    <CardHeader className="h-[50px] flex al">
                      <div className="font-bold">{price.name}</div>
                      <div className="ml-3 text-sm text-success-400">
                        {price.desc}
                      </div>
                    </CardHeader>
                    <CardBody>
                      <div className="text-4xl font-bold">
                        ${price.monthly} <sub>/ month</sub>
                      </div>

                      <div className="mt-3 text-sm opacity-50">
                        Billed ${price.price} {price.name}
                      </div>

                      <div>
                        <Button className="mt-5 float-right">Subscribe</Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div >
    </>
  );
};

export default Lander;
