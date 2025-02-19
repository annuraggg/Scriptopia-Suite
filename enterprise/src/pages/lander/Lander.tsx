import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/types/Reducer";
import { Button } from "@/components/ui/button";
import { WavyBackground } from "@/components/ui/wavy-background";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Timeline } from "@/components/ui/timeline";
import { SparklesCore } from "@/components/ui/sparkles";

const LargeHeading = ({ children }: any) => {
  return (
    <h1
      className={`text-4xl md:text-5xl lg:text-5xl pb-3 text-center font-gloock font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600`}
    >
      {children}
    </h1>
  );
};

const Lander = () => {
  const navigate = useNavigate();
  const organization = useSelector((state: RootState) => state.organization);

  const redirectUser = () => {
    if (organization._id) {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  };

  const projects = [
    {
      title: "Smart Job Postings",
      description:
        "Create and manage job postings with AI assistance that helps you write better descriptions and reach the right candidates.",
    },
    {
      title: "AI-Powered Matching",
      description:
        "Our advanced algorithms match candidates to jobs based on skills, experience, and cultural fit with unprecedented accuracy.",
    },
    {
      title: "Custom Assessments",
      description:
        "Design role-specific assessments that evaluate both technical skills and soft skills to ensure the perfect fit.",
    },
    {
      title: "Intelligent Screening",
      description:
        "Automate initial candidate screening with AI that understands context and nuance in resumes and applications.",
    },
    {
      title: "Virtual Interviews",
      description:
        "Conduct seamless online interviews with built-in scheduling, recording, and AI-powered insights.",
    },

    {
      title: "Real-time Analytics",
      description:
        "Get instant insights into your hiring process with comprehensive analytics and customizable dashboards.",
    },
  ];

  const data = [
    {
      title: "Job Posting and Requisition Management",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Effortlessly create and distribute job postings to multiple
            platforms. Track and manage job requisitions with ease.
          </p>{" "}
          <img
            src="/t11.png"
            className="rounded-lg h-[500px] w-[500px] object-cover md:h-44 lg:h-60 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />{" "}
          <img
            src="/t12.png"
            className="rounded-lg mt-5 h-[500px] w-[500px] object-cover md:h-44 lg:h-60 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />{" "}
        </div>
      ),
    },
    {
      title: "Application Collection",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Collect applications from job boards, company websites, and direct
            submissions. Parse and store applicant information, resumes, and
            cover letters securely.
          </p>
          <img
            src="/t21.png"
            className="rounded-lg mt-5 h-[500px] w-[500px] object-cover md:h-44 lg:h-60 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />{" "}
        </div>
      ),
    },
    {
      title: "Automated Resume Screening",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Display a curated list of selected candidates for your review.
            Easily manage and track candidate progress.
          </p>
          <img
            src="/t31.png"
            className="rounded-lg h-[500px] w-[500px] object-cover md:h-44 lg:h-60 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
          <img
            src="/t32.png"
            className="rounded-lg mt-5 h-[500px] w-[500px] object-cover md:h-44 lg:h-60 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />{" "}
        </div>
      ),
    },
    {
      title: " Assessments",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Create tailored assessments including multiple-choice questions and
            coding challenges. Evaluate candidates' skills directly on our
            platform.
          </p>
          <img
            src="/t41.png"
            className="rounded-lg h-[500px] w-[500px] object-cover md:h-44 lg:h-60 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
          <img
            src="/t42.png"
            className="rounded-lg h-[500px] w-[500px] object-cover md:h-44 lg:h-60 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
        </div>
      ),
    },
    {
      title: "  Conduct Interviews",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Schedule interviews, communicate with candidates, and gather
            feedback seamlessly.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-white text-gray-900 ">
      {/* Header */}
      <header className="relative z-20 px-6 lg:px-20 py-6 flex justify-between items-center border-b border-gray-100">
        <img src="/logo.svg" alt="logo" className="w-12 h-12" />
        <div className="flex items-center gap-4">
          <Button
            onClick={redirectUser}
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 cursor-not-allowed"
            disabled={true}
          
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Product Preview Section */}
      <div className="mt-32 w-full">
        <WavyBackground backgroundFill="white" className="w-full">
          <ContainerScroll
            titleComponent={
              <div>
                <p className="text-2xl md:text-4xl lg:text-7xl font-bold font-gloock text-center">
                  The Future of Hiring is Here
                </p>
                <p className="text-base md:text-sm mt-4  font-normal inter-var text-center mb-10">
                  Transform your recruitment process with our AI-powered
                  platform that makes hiring smarter, faster, and more efficient
                  than ever before.
                </p>
              </div>
            }
          >
            <img
              src={`/lander1.png`}
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top"
              draggable={false}
            />
          </ContainerScroll>
        </WavyBackground>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-32">
        <LargeHeading>Everything you need to hire better</LargeHeading>
        <HoverEffect items={projects} />
      </div>

      {/* How it Works Section */}
      <div className="w-full">
        <Timeline data={data} />
      </div>

      {/* Platform launching soon message */}
      <section className="relative z-20 px-6 lg:px-20 py-20  text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-caveat text-7xl">Platform Launching Soon</h1>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-5 ">
        <div className="w-full bg-white flex flex-col items-center justify-center overflow-hidden rounded-md">
          <div className="max-w-6xl mx-auto text-center text-gray-600">
            <p>© 2025 Scriptopia. All rights reserved.</p>
          </div>
          <div className="w-[40rem] relative">
            {/* Core component */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-[5vh]"
              particleColor="#000000"
            />

            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 w-full h-full bg-white [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Lander;
