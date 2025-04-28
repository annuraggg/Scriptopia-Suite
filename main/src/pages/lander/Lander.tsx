import React, { useState } from "react";
import {
  FiCode,
  FiVideo,
  FiMenu,
  FiX,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding } from "react-icons/hi";

// Import AceTernity UI components
import { TextRevealCard } from "@/components/text-reveal-card";
import { StickyScroll } from "@/components/sticky-scroll-reveal";
import { HoverEffect } from "@/components/card-hover-effect";
import { HeroHighlight, Highlight } from "@/components/hero-highlight";

import { motion } from "motion/react";

// Define types for our components
interface FeaturePointProps {
  text: string;
}

interface TabItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface StickyScrollItem {
  title: string;
  description: string;
  content: React.ReactNode;
}

interface FeatureCard {
  title: string;
  description: string;
  link: string;
}

const ScriptopiaLanding: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("enterprise");

  // Feature cards for HoverEffect component - Expanded to 6 items
  const scriptopiaFeatures = [
    {
      title: "Enterprise Talent Acquisition",
      description:
        "Complete ATS functionality with custom assessment tools, analytics dashboard, and team collaboration features.",
      link: "#enterprise",
    },
    {
      title: "Campus Recruitment",
      description:
        "Bridge the gap between educational institutions and companies with placement management and metrics.",
      link: "#campus",
    },
    {
      title: "Coding Assessment Platform",
      description:
        "Comprehensive coding practice with multi-language support and advanced problem definition capabilities.",
      link: "#code",
    },
    {
      title: "Technical Interview Suite",
      description:
        "Real-time code collaboration, HD video, and interactive whiteboards for effective technical interviews.",
      link: "#meet",
    },
    {
      title: "Enhanced Candidate Experience",
      description:
        "Intuitive interfaces and workflows designed for optimal candidate satisfaction and engagement.",
      link: "#candidate",
    },
    {
      title: "Advanced Analytics",
      description:
        "Gain insights into your recruitment funnel with detailed metrics and customizable reporting.",
      link: "#analytics",
    },
  ];

  // Enterprise features - Updated to 6 cards
  const enterpriseFeatures: FeatureCard[] = [
    {
      title: "Applicant Tracking System",
      description:
        "Manage your entire recruitment pipeline in one place with advanced filtering and candidate tracking.",
      link: "/enterprise/ats",
    },
    {
      title: "Custom Assessment Builder",
      description:
        "Create tailored technical assessments for different roles with a flexible builder interface.",
      link: "/enterprise/assessments",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Get actionable insights into your recruitment process with comprehensive reporting.",
      link: "/enterprise/analytics",
    },
    {
      title: "Role-Based Access Control",
      description:
        "Manage permissions and access levels for different team members in your organization.",
      link: "/enterprise/rbac",
    },
    {
      title: "Custom Branding",
      description:
        "Apply your organization's branding throughout the recruitment process for a cohesive experience.",
      link: "/enterprise/branding",
    },
    {
      title: "Workflow Automation",
      description:
        "Create custom recruitment workflows to streamline your hiring process and reduce manual tasks.",
      link: "/enterprise/automation",
    },
  ];

  // Campus features - Updated to 6 cards
  const campusFeatures: FeatureCard[] = [
    {
      title: "Institution Dashboard",
      description:
        "Complete overview of placement activities and metrics for educational institutions.",
      link: "/campus/dashboard",
    },
    {
      title: "Student Management",
      description:
        "Track student eligibility, applications, and placement status throughout the process.",
      link: "/campus/students",
    },
    {
      title: "Placement Statistics",
      description:
        "Track performance metrics and placement statistics with visual reporting tools.",
      link: "/campus/statistics",
    },
    {
      title: "Placement Drive Management",
      description:
        "Organize and manage campus recruitment drives with calendar and scheduling tools.",
      link: "/campus/drives",
    },
    {
      title: "Resume Repository",
      description:
        "Centralized student resume database with powerful search and filtering capabilities.",
      link: "/campus/resumes",
    },
    {
      title: "Batch Management",
      description:
        "Organize students by batches, courses, and specializations for efficient placement management.",
      link: "/campus/batches",
    },
  ];

  // Code features - Updated to 6 cards
  const codeFeatures: FeatureCard[] = [
    {
      title: "Problem Library",
      description:
        "Access curated coding challenges across different domains and difficulty levels.",
      link: "/code/problems",
    },
    {
      title: "5+ Programming Languages",
      description:
        "Code in popular programming languages including Java, Python, JavaScript, C++, and C#.",
      link: "/code/languages",
    },
    {
      title: "Custom SDSL",
      description:
        "Advanced Scriptopia Domain Specific Language for precise problem definition.",
      link: "/code/sdsl",
    },
    {
      title: "Performance Analytics",
      description:
        "Track your progress with detailed performance metrics and learning recommendations.",
      link: "/code/analytics",
    },
    {
      title: "Code Playback",
      description:
        "Review coding sessions with step-by-step playback to analyze solution approaches.",
      link: "/code/playback",
    },
    {
      title: "Editorial Solutions",
      description:
        "Learn from expert-written solutions and explanations for each coding challenge.",
      link: "/code/editorials",
    },
  ];

  // Meet features - Updated to 6 cards
  const meetFeatures: FeatureCard[] = [
    {
      title: "HD Video Conferencing",
      description:
        "Stable, high-quality video built specifically for technical interviews.",
      link: "/meet/video",
    },
    {
      title: "Interview Scheduling",
      description:
        "Manage interview slots and calendar integrations for streamlined coordination.",
      link: "/meet/scheduling",
    },
    {
      title: "Structured Evaluation",
      description:
        "Standardized assessment framework for consistent candidate evaluations.",
      link: "/meet/evaluation",
    },
    {
      title: "Code Execution Environment",
      description:
        "Run and test code during interviews with support for multiple programming languages.",
      link: "/meet/execution",
    },
    {
      title: "Diagram Tool",
      description:
        "Create flowcharts and system design diagrams for architectural discussions.",
      link: "/meet/diagrams",
    },
    {
      title: "Screen Sharing",
      description:
        "Share application windows and screens during technical discussions and presentations.",
      link: "/meet/screenshare",
    },
  ];

  // Platform content for StickyScroll component
  const platformsContent: StickyScrollItem[] = [
    {
      title: "Scriptopia Enterprise",
      description:
        "Our enterprise solution provides HR teams and talent acquisition specialists with powerful tools to streamline the entire hiring process, from job posting to onboarding. With customizable workflows, advanced reporting, and seamless integration with your existing HR systems, Scriptopia Enterprise adapts to your organization's specific needs.",
      content: (
        <div className="h-full w-full bg-white flex items-center justify-center rounded-2xl overflow-hidden">
          <img
            src="https://placehold.co/800x500/ffffff/4f46e5?text=Scriptopia+Enterprise"
            alt="Scriptopia Enterprise"
            className="rounded-xl shadow-md w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      title: "Scriptopia Campus",
      description:
        "Our campus placement solution bridges the gap between educational institutions and companies, making it easier to manage recruitment drives, student profiles, and placement metrics. Designed with both college placement cells and recruiting companies in mind, Scriptopia Campus streamlines the entire campus hiring process from start to finish.",
      content: (
        <div className="h-full w-full bg-white flex items-center justify-center rounded-2xl overflow-hidden">
          <img
            src="https://placehold.co/800x500/ffffff/8b5cf6?text=Scriptopia+Campus"
            alt="Scriptopia Campus"
            className="rounded-xl shadow-md w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      title: "Scriptopia Code",
      description:
        "A comprehensive coding practice platform with a curated library of problems across different difficulty levels and support for multiple programming languages. Scriptopia Code offers a feature-rich environment for developers and candidates to practice coding problems, prepare for technical interviews, and enhance their programming skills.",
      content: (
        <div className="h-full w-full bg-white flex items-center justify-center rounded-2xl overflow-hidden">
          <img
            src="https://placehold.co/800x500/ffffff/6366f1?text=Scriptopia+Code"
            alt="Scriptopia Code"
            className="rounded-xl shadow-md w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      title: "Scriptopia Meet",
      description:
        "Our specialized interview platform combines high-quality video conferencing with code execution tools, making it the perfect environment for technical interviews. Scriptopia Meet enables interviewers to evaluate candidates effectively with code execution environments, diagramming tools, and structured evaluation frameworks.",
      content: (
        <div className="h-full w-full bg-white flex items-center justify-center rounded-2xl overflow-hidden">
          <img
            src="https://placehold.co/800x500/ffffff/a855f7?text=Scriptopia+Meet"
            alt="Scriptopia Meet"
            className="rounded-xl shadow-md w-full h-full object-cover"
          />
        </div>
      ),
    },
  ];

  // Helper function to render feature points
  const FeaturePoint: React.FC<FeaturePointProps> = ({ text }) => {
    return (
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <FiCheck className="h-4 w-4" />
          </div>
        </div>
        <p className="ml-3 text-base text-gray-700">{text}</p>
      </div>
    );
  };

  // Tabs with underline component - Modified to take full width
  const TabsWithUnderline: React.FC<{
    tabs: TabItem[];
    activeTab: string;
    setActiveTab: (id: string) => void;
  }> = ({ tabs, activeTab, setActiveTab }) => {
    return (
      <div className="border-b border-gray-200">
        <div className="grid grid-cols-4 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-6 text-center flex flex-col items-center justify-center gap-2 border-b-2 transition-colors duration-200
                ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const tabs: TabItem[] = [
    {
      id: "enterprise",
      name: "Enterprise",
      icon: <HiOutlineOfficeBuilding className="h-6 w-6" />,
    },
    {
      id: "campus",
      name: "Campus",
      icon: <HiOutlineAcademicCap className="h-6 w-6" />,
    },
    { id: "code", name: "Code", icon: <FiCode className="h-6 w-6" /> },
    { id: "meet", name: "Meet", icon: <FiVideo className="h-6 w-6" /> },
  ];

  // Platform navigation links - WITH ADJUSTED SPACING
  const platformLinks = [
    { name: "Enterprise", url: "https://enterprise.scriptopia.tech" },
    { name: "Campus", url: "https://campus.scriptopia.tech" },
    { name: "Code", url: "https://code.scriptopia.tech" },
    { name: "Candidate", url: "https://candidate.scriptopia.tech" },
    { name: "Meet", url: "https://meet.scriptopia.tech" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation - ADJUSTED SPACING */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img className="h-10 w-auto" src="/logo.svg" alt="Scriptopia" />
                <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                  Scriptopia
                </span>
              </div>
              <div className="hidden md:ml-12 md:flex md:space-x-6">
                {platformLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <FiX className="block h-6 w-6" />
                ) : (
                  <FiMenu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {platformLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.url}
                  className={`${
                    index === 0
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>{" "}
      <div>
        <HeroHighlight>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="text-7xl md:text-6xl lg:text-7xl font-extrabold text-gray-700 space text-center"
          >
            The Complete{" "}
            <Highlight className="  text-black">Tech Recruitment</Highlight>
            <br /> <p className="mt-4">Platform</p>
          </motion.h1>

          <div className="text-center max-w-4xl mx-auto">
            <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-800">
              Scriptopia powers the entire tech recruitment journey from campus
              selection to enterprise hiring, coding assessments, and remote
              interviews—all in one integrated platform.
            </p>
            <div className="mt-12">
              <a
                href="#platform"
                className="py-4 px-8 rounded-md text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md"
              >
                Explore Platform
              </a>
            </div>
          </div>
        </HeroHighlight>
      </div>
      {/* Text Reveal Card Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <TextRevealCard
            text="Experience the future of technical recruitment"
            revealText="Scriptopia transforms how you recruit tech talent"
            className="w-full border-0 rounded-none bg-transparent shadow-none text-center"
          />
        </div>
      </div>
      {/* Platform Overview Section - UPDATED STICKY SCROLL */}
      <div id="platform" className="py-24 bg-white">
        <div className="max-w-full mx-auto">
          <div className="text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              The Scriptopia Suite
            </h2>
            <h3 className="mt-2 text-5xl font-extrabold text-gray-900">
              One Platform,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Four Powerful Solutions
              </span>
            </h3>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500">
              Scriptopia is designed to simplify tech recruitment with a
              comprehensive suite of tools for modern talent acquisition needs.
            </p>
          </div>

          <div className="mt-20 h-[90vh]">
            <StickyScroll
              content={platformsContent}
              contentClassName="border-0"
            />
          </div>
        </div>
      </div>
      {/* Platform Features Overview */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              Key Features
            </h2>
            <h3 className="mt-2 text-4xl font-extrabold text-gray-900">
              What Makes Scriptopia Different
            </h3>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500">
              Our suite of solutions work together seamlessly to power your
              entire technical recruitment process.
            </p>
          </div>

          <div className="mt-16">
            <HoverEffect items={scriptopiaFeatures} />
          </div>
        </div>
      </div>
      {/* Detailed Platform Tabs Section */}
      <div id="solutions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              In-Depth Solutions
            </h2>
            <h3 className="mt-2 text-4xl font-extrabold text-gray-900">
              Explore Our Platform Components
            </h3>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500">
              Each solution in the Scriptopia suite is designed to handle
              specific aspects of the technical recruitment process.
            </p>
          </div>

          <TabsWithUnderline
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Tab Content - UPDATED WITH CORRECTED FEATURES */}
          <div className="mt-16">
            {activeTab === "enterprise" && (
              <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                <div className="lg:col-span-5">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      Streamline Enterprise Talent Acquisition
                    </h3>
                    <p className="mt-4 text-lg text-gray-600">
                      Scriptopia Enterprise is a comprehensive talent
                      acquisition platform designed specifically for technical
                      recruitment needs.
                    </p>
                    <div className="mt-8 space-y-4">
                      <FeaturePoint text="Complete ATS Functionality - Manage your entire recruitment pipeline in one place." />
                      <FeaturePoint text="Custom Assessment Builder - Create tailored technical assessments for different roles." />
                      <FeaturePoint text="Analytics Dashboard - Get actionable insights into your recruitment process." />
                      <FeaturePoint text="Role-Based Access Control - Manage permissions for different team members." />
                      <FeaturePoint text="Custom Branding - Apply your organization's branding throughout the process." />
                    </div>
                    <div className="mt-10">
                      <a
                        href="https://enterprise.scriptopia.tech"
                        className="px-6 py-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 font-medium inline-flex items-center shadow-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Go to Enterprise Platform{" "}
                        <FiArrowRight className="ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-12 lg:mt-0 lg:col-span-7">
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img
                      className="w-full"
                      src="https://placehold.co/800x500/ffffff/4f46e5?text=Enterprise+Dashboard"
                      alt="Scriptopia Enterprise Dashboard interface"
                    />
                  </div>
                </div>

                <div className="lg:col-span-12 mt-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">
                    Enterprise Features
                  </h3>
                  <HoverEffect items={enterpriseFeatures} />
                </div>
              </div>
            )}

            {activeTab === "campus" && (
              <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                <div className="lg:col-span-7">
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img
                      className="w-full"
                      src="https://placehold.co/800x500/ffffff/8b5cf6?text=Campus+Portal"
                      alt="Scriptopia Campus Portal interface"
                    />
                  </div>
                </div>
                <div className="mt-12 lg:mt-0 lg:col-span-5">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      Revolutionize Campus Placements
                    </h3>
                    <p className="mt-4 text-lg text-gray-600">
                      Scriptopia Campus simplifies the entire campus placement
                      process for educational institutions and recruiters.
                    </p>
                    <div className="mt-8 space-y-4">
                      <FeaturePoint text="Institution Dashboard - Complete overview of placement activities and metrics." />
                      <FeaturePoint text="Student Management - Track student eligibility, applications, and placement status." />
                      <FeaturePoint text="Placement Statistics - Track performance metrics and placement statistics." />
                      <FeaturePoint text="Placement Drive Management - Organize and manage campus recruitment drives." />
                      <FeaturePoint text="Resume Repository - Centralized student resume database with search capabilities." />
                    </div>
                    <div className="mt-10">
                      <a
                        href="https://candidate.scriptopia.tech"
                        className="px-6 py-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 font-medium inline-flex items-center shadow-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Go to Candidate Platform{" "}
                        <FiArrowRight className="ml-2" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-12 mt-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">
                    Campus Features
                  </h3>
                  <HoverEffect items={campusFeatures} />
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                <div className="lg:col-span-5">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      Master Technical Skills with Scriptopia Code
                    </h3>
                    <p className="mt-4 text-lg text-gray-600">
                      A comprehensive platform for coding practice, technical
                      interview preparation, and skill assessment.
                    </p>
                    <div className="mt-8 space-y-4">
                      <FeaturePoint text="Problem Library - Access curated coding challenges across different domains." />
                      <FeaturePoint text="5+ Programming Languages - Code in Java, Python, JavaScript, C++, and C#." />
                      <FeaturePoint text="Custom SDSL - Advanced Scriptopia Domain Specific Language for problem definition." />
                      <FeaturePoint text="Performance Analytics - Track your progress with detailed performance metrics." />
                      <FeaturePoint text="Editorial Solutions - Learn from expert-written solutions for each coding challenge." />
                    </div>
                    <div className="mt-10">
                      <a
                        href="https://code.scriptopia.tech"
                        className="px-6 py-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 font-medium inline-flex items-center shadow-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Go to Code Platform <FiArrowRight className="ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-12 lg:mt-0 lg:col-span-7">
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img
                      className="w-full"
                      src="https://placehold.co/800x500/ffffff/6366f1?text=Code+IDE"
                      alt="Scriptopia Code IDE interface"
                    />
                  </div>
                </div>

                <div className="lg:col-span-12 mt-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">
                    Code Features
                  </h3>
                  <HoverEffect items={codeFeatures} />
                </div>
              </div>
            )}

            {activeTab === "meet" && (
              <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                <div className="lg:col-span-7">
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img
                      className="w-full"
                      src="https://placehold.co/800x500/ffffff/a855f7?text=Meet+Interface"
                      alt="Scriptopia Meet interface"
                    />
                  </div>
                </div>
                <div className="mt-12 lg:mt-0 lg:col-span-5">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      Conduct Seamless Technical Interviews
                    </h3>
                    <p className="mt-4 text-lg text-gray-600">
                      Scriptopia Meet is purpose-built for technical interviews
                      with video conferencing and code execution tools.
                    </p>
                    <div className="mt-8 space-y-4">
                      <FeaturePoint text="HD Video Conferencing - Stable, high-quality video for interviews." />
                      <FeaturePoint text="Interview Scheduling - Manage interview slots with calendar integrations." />
                      <FeaturePoint text="Structured Evaluation - Standardized assessment framework for evaluations." />
                      <FeaturePoint text="Code Execution Environment - Run code during interviews with multiple language support." />
                      <FeaturePoint text="Screen Sharing - Share windows and screens during technical discussions." />
                    </div>
                    <div className="mt-10">
                      <a
                        href="https://meet.scriptopia.tech"
                        className="px-6 py-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 font-medium inline-flex items-center shadow-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Go to Meet Platform <FiArrowRight className="ml-2" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-12 mt-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">
                    Meet Features
                  </h3>
                  <HoverEffect items={meetFeatures} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* CTA Section - UPDATED WITH SPECIFIC PLATFORM BUTTONS */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-16 sm:py-24 sm:px-12 text-center shadow-xl">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight">
              Ready to transform your tech recruitment?
            </h2>
            <p className="mt-5 text-xl text-indigo-100 max-w-3xl mx-auto">
              Choose the platform that best fits your needs and get started
              today.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              {platformLinks.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  className="py-3 px-5 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {platform.name} Platform
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center">
                <img className="h-8 w-auto" src="/logo.svg" alt="Scriptopia" />
                <span className="ml-2 text-xl font-bold text-white">
                  Scriptopia
                </span>
              </div>
              <p className="mt-4 text-gray-400">
                The complete tech recruitment platform for modern hiring needs.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Platforms
              </h3>
              <ul className="mt-4 space-y-4">
                {platformLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      className="text-base text-gray-300 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#about"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#privacy"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-base text-gray-300 hover:text-white"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2025 Scriptopia Technology Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ScriptopiaLanding;
