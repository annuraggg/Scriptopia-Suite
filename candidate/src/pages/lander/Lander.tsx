import React from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFileText,
  FiCode,
  FiBriefcase,
  FiTrendingUp,
  FiLayers,
  FiCheckCircle,
  FiUsers,
  FiAward,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      {/* Header Section */}
      <header className="container1 mx-auto px-6 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-6">
            Welcome to <span className="text-indigo-500">Scriptopia</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Your personal gateway to tech opportunities. Find jobs, showcase
            your skills, and launch your career in technology.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
            >
              Register Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-600 font-medium px-8 py-3 rounded-lg shadow-lg border border-indigo-200 hover:bg-indigo-50 transition duration-300"
            >
              Explore Platform
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* Main Features Section */}
      <section className="py-20 bg-white">
        <div className="container1 mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-4">
            Built for Tech Candidates Like You
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            Streamline your job search and showcase your technical abilities
            with our comprehensive platform tailored for tech professionals.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<FiSearch className="text-4xl text-indigo-500" />}
              title="Job Discovery"
              description="Find tech opportunities matching your skills and preferences with our smart job matching algorithm."
            />
            <FeatureCard
              icon={<FiFileText className="text-4xl text-indigo-500" />}
              title="Smart Profile"
              description="Create a dynamic profile that showcases your skills, projects, and experiences to potential employers."
            />
            <FeatureCard
              icon={<FiCode className="text-4xl text-indigo-500" />}
              title="Skills Assessment"
              description="Validate your technical abilities through tailored coding challenges and showcase verified badges."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-indigo-50">
        <div className="container1 mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-16">
            How Scriptopia Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <ProcessCard
              step="01"
              title="Create Your Profile"
              description="Build a comprehensive tech profile highlighting your skills, experience, and portfolio."
              icon={<FiUsers />}
            />
            <ProcessCard
              step="02"
              title="Showcase Projects"
              description="Upload and display your coding projects, contributions, and technical achievements."
              icon={<FiLayers />}
            />
            <ProcessCard
              step="03"
              title="Match with Jobs"
              description="Get automatically matched with positions that align with your skill set and preferences."
              icon={<FiBriefcase />}
            />
            <ProcessCard
              step="04"
              title="Track Applications"
              description="Manage all your job applications and interviews in one organized dashboard."
              icon={<FiTrendingUp />}
            />
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-20 bg-white">
        <div className="container1 mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-4">
            Comprehensive Platform Features
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            Our platform is built with the modern tech candidate in mind,
            offering tools and features to accelerate your career journey.
          </p>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            <DetailedFeatureCard
              icon={<FiFileText />}
              title="Interactive Resume Builder"
              description="Create standout tech resumes with our guided builder that highlights relevant skills and experiences for tech roles. Export to multiple formats or share directly with employers."
            />
            <DetailedFeatureCard
              icon={<FiCode />}
              title="Technical Skills Showcase"
              description="Display your programming languages, frameworks, and tools with proficiency indicators. Link to your GitHub repositories and demonstrate your coding abilities with embedded code snippets."
            />
            <DetailedFeatureCard
              icon={<FiBriefcase />}
              title="Personalized Job Recommendations"
              description="Receive tailored job suggestions based on your technical stack, experience level, and career preferences. Set custom alerts for roles matching your criteria."
            />
            <DetailedFeatureCard
              icon={<FiCheckCircle />}
              title="Application Tracking System"
              description="Manage all your job applications in one dashboard with status updates, interview schedules, and follow-up reminders. Never miss an important deadline or interview again."
            />
            <DetailedFeatureCard
              icon={<FiAward />}
              title="Skill Assessment & Certification"
              description="Validate your technical skills through our assessment modules and earn badges that verify your proficiency. Showcase these certifications to potential employers."
            />
            <DetailedFeatureCard
              icon={<FiTrendingUp />}
              title="Career Development Resources"
              description="Access industry insights, tech interview preparation materials, salary guidelines, and professional growth resources tailored to your career stage."
            />
          </div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="py-16 bg-indigo-700 text-white">
        <div className="container1 mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Coming Soon!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Scriptopia is currently in final development and will be launching
            soon. Be among the first to experience the future of tech career
            management.
          </p>
          <div className="flex justify-center">
            <div className="bg-white bg-opacity-20 rounded-lg px-8 py-4 inline-block">
              <p className="text-lg font-medium">Launch Date: Summer 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-10">
        <div className="container1 mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">Scriptopia</h2>
              <p className="text-indigo-300">Your tech career companion</p>
            </div>
            <div className="flex gap-6">
              <Link
                to="/"
                className="text-indigo-200 hover:text-white transition"
              >
                Home
              </Link>
              <Link
                to="/features"
                className="text-indigo-200 hover:text-white transition"
              >
                Features
              </Link>
              <Link
                to="/about"
                className="text-indigo-200 hover:text-white transition"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-indigo-200 hover:text-white transition"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="border-t border-indigo-800 mt-8 pt-8 text-center text-indigo-300">
            <p>
              &copy; {new Date().getFullYear()} Scriptopia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Component for feature cards
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100 hover:border-indigo-300 transition duration-300"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-indigo-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

// Component for process step cards
const ProcessCard: React.FC<{
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ step, title, description, icon }) => {
  return (
    <div className="relative flex flex-col items-center text-center px-4">
      <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <div className="absolute top-0 left-0 bg-indigo-600 text-white font-bold py-1 px-3 rounded-full text-sm">
        {step}
      </div>
      <h3 className="text-xl font-bold text-indigo-800 mb-3 mt-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
      {/* Connection line for desktop */}
      <div
        className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-indigo-200 -z-10 transform -translate-x-1/2"
        style={{ display: step === "04" ? "none" : "" }}
      ></div>
    </div>
  );
};

// Component for detailed feature cards
const DetailedFeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex gap-5"
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xl">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-indigo-800 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export default LandingPage;
