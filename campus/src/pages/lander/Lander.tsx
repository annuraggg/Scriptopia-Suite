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
  const organization = useSelector((state: RootState) => state.institute);

  const redirectUser = () => {
    if (organization._id) {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  };

  const projects = [
    {
      title: "Placement Drive Management",
      description:
        "Effortlessly organize and manage multiple company placement drives, schedule events, and track participation all from one dashboard.",
    },
    {
      title: "Student Eligibility & Tracking",
      description:
        "Manage student profiles, track eligibility criteria fulfillment, and monitor student progress through various rounds of placement drives.",
    },
    {
      title: "Stage-wise Elimination Tracking",
      description:
        "Monitor student performance across written tests, group discussions, technical and HR interviews with detailed elimination tracking.",
    },
    {
      title: "Company Relationship Management",
      description:
        "Maintain recruiter databases, track company visits, and build long-term relationships with industry partners for your institute.",
    },
    {
      title: "Offer Letter Management",
      description:
        "Efficiently track job offers, manage acceptance rates, and maintain comprehensive records of student placements and packages.",
    },
    {
      title: "Placement Analytics",
      description:
        "Generate insightful reports on placement statistics, department-wise performance, and yearly placement trends for your institute.",
    },
  ];

  const data = [
    {
      title: "Drive Registration & Management",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Register incoming companies for placement drives, manage schedules,
            and track all drive-related activities centrally for your
            institution.
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
      title: "Student Registration & Eligibility",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Track student registrations for placement drives, verify eligibility
            criteria, and manage department-wise student data for placement
            activities.
          </p>
          <img
            src="/t21.png"
            className="rounded-lg mt-5 h-[500px] w-[500px] object-cover md:h-44 lg:h-60 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />{" "}
        </div>
      ),
    },
    {
      title: "Round-wise Student Tracking",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Monitor student performance through various elimination rounds -
            from aptitude tests to technical interviews, with comprehensive
            stage-wise tracking.
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
      title: "Placement Results Management",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Record and manage placement outcomes, generate offer letters, and
            maintain comprehensive placement records for institutional
            reporting.
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
      title: "Analytics & Reporting",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Generate comprehensive reports on placement statistics, company-wise
            offers, and student performance to showcase your institute's
            placement excellence.
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
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6"
          >
            {organization._id ? "Go to Dashboard" : "Get Started"}
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
                  Simplify Your Institute's Placement Management
                </p>
                <p className="text-base md:text-sm mt-4 font-normal inter-var text-center mb-10">
                  A comprehensive platform for educational institutions to
                  streamline campus placement activities, track student
                  progress, and manage company relationships effortlessly.
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
        <LargeHeading>Everything your placement cell needs</LargeHeading>
        <HoverEffect items={projects} />
      </div>

      {/* How it Works Section */}
      <div className="w-full">
        <Timeline data={data} />
      </div>

      {/* Platform launching soon message */}
      <section className="relative z-20 px-6 lg:px-20 py-20 text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-caveat text-7xl">
            Elevate Your Placement Management Now!
          </h1>
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
