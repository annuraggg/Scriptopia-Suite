import { Button } from "@nextui-org/react";
import { useTheme } from "@/components/theme-provider";
import { ArrowRight } from "lucide-react";
import Navbar from "./Navbar"
import Logo from "../../assets/logo.png";
import img1 from "../../assets/IMG 1.png"
import img2 from "../../assets/IMG 2.png"
import img3 from "../../assets/IMG 3.png"

interface RibbonItem {
  text: string;
  icon?: string;
}

const Lander = () => {
  const { theme } = useTheme();
  const ribbonItems: RibbonItem[] = [
    { text: "CODE" },
    { text: "LEARN" },
    { text: "COMPETE" },
    { text: "ASSESS" },
    { text: "INTERVIEW" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="flex min-h-[500px] px-8 md:px-16 mt-10">
        <div className="relative flex flex-col w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row w-full justify-between gap-20">
            <div className="flex-1 py-18">
              <h1 className="text-[#B4F4E3] text-6xl md:text-9xl font-medium mb-6 leading-tight">
                Learn,
                <br />
                {"{Code}"},
                <br />
                Compete.
              </h1>
            </div>

            <div className="flex-1 text-white">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                Elevate Your Coding Skills
              </h2>
              <p className="text-lg md:text-xl text-gray-500 mb-8">
                Discover a versatile coding platform that enhances your skills and
                streamlines hiring solutions.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#B4F4E3] rounded-full"></span>
                  <span>Comprehensive Problem Collection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#B4F4E3] rounded-full"></span>
                  <span>A Simple Method for Evaluating All</span>
                </li>
              </ul>
              <Button
                className="bg-[#4A5D53] text-white hover:bg-[#3A4D43] transition-colors relative overflow-hidden"
                endContent={<ArrowRight className="w-4 h-4" />}
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 shine"></div>
              </Button>
            </div>
          </div>

          <div className="w-full text-center mt-8">
            <p className="text-sm text-gray-400">Your Path to Mastery</p>
          </div>
        </div>
      </section>

      <div
        className={`overflow-hidden ${theme === "light" ? "bg-default-100" : "bg-default-50"
          } py-8`}
      >
        <div className="flex animate-scroll">
          {[...Array(3)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex whitespace-nowrap">
              {ribbonItems.map((item, index) => (
                <div
                  key={`${groupIndex}-${index}`}
                  className="flex items-center justify-center px-8 gap-3 "
                >
                  <p className="font-bold text-2xl md:text-3xl">{item.text}</p>
                  <img src={Logo} alt="Logo" className="w-8 h-8 ml-4" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="relative py-6 px-4 md:px-6">
        <div className="w-full aspect-video max-w-3xl mx-auto mb-16 flex items-center justify-center rounded-lg">
          <img src={img1} alt="Laptop" className="w-full h-full object-cover rounded-lg" />
        </div>

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h3 className="text-gray-400 text-base md:text-lg">
            Unlock the Power of a Versatile Coding Platform
          </h3>

          <div className="space-y-4">
            <p className="text-white text-3xl md:text-4xl font-medium leading-relaxed">
              Experience an innovative coding platform for{" "}
              <span className="text-[#B4F4E3] glow-effect">assessments</span>,{" "}
              <span className="block md:inline">
                development, and learning. With expertise in{" "}
                <span className="text-[#B4F4E3] glow-effect">coding challenges</span> and{" "}
                <span className="text-[#B4F4E3] glow-effect">hiring solutions</span>, we
                deliver{" "}
                <span className="text-[#B4F4E3] glow-effect">fast results</span> while
                enhancing your{" "}
                <span className="text-[#B4F4E3] glow-effect">skills</span>
              </span>
            </p>
          </div>
        </div>

        <div className="w-full h-full pt-14">
          <section className="bg-purple-500 py-20 px-4 md:px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-4">Extensive List of Problems</h3>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Choose from a wide range of problems across languages and difficulty levels to sharpen your coding skills.
                </h2>
                <Button
                  className="bg-black text-white px-6 py-3"
                  endContent={<ArrowRight className="w-4 h-4" />}
                >
                  Start Assessing
                </Button>
              </div>
              <div className="flex-1">
                <img
                  src={img2}
                  alt="img2"
                  className="w-full h-full object-cover floating-image"
                />
              </div>
            </div>
          </section>

          <section className="bg-orange-400 py-20 px-4 md:px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-start justify-between gap-12">
                <div className="w-full md:w-1/2 z-10">
                  <h3 className="text-xl font-medium mb-4">An Easy Way to Assess Everyone</h3>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Assessing candidates has never been easier. Our platform provides a seamless way to assess and evaluate candidates based on their coding skills.
                  </h2>
                  <Button
                    className="bg-black text-white px-6 py-3"
                    endContent={<ArrowRight className="w-4 h-4" />}
                  >
                    Start Solving Now
                  </Button>
                </div>

                <div className="absolute bottom-0 right-0 w-full md:w-[50%] h-[100%]">
                  <img
                    src={img3}
                    alt="img3"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 px-4 md:px-6 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Reached the End?
              </h2>

              <div className="text-4xl md:text-5xl font-bold mb-12">
                Time to <span className="text-[#B4F4E3]">&lt;CODE/&gt;</span>
              </div>

              <div className="flex items-center justify-center gap-6">
                <Button
                  as="a"
                  href="https://docs.scriptopia.tech/"
                  variant="light"
                  className="text-[#B4F4E3] hover:bg-[#B4F4E3]/10 px-6 py-2"
                  radius="sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Documentation
                </Button>

                <Button
                  className="bg-[#B4F4E3] text-black hover:bg-[#A3E3D2] transition-colors px-6 py-2 drop-shadow-glow"
                  endContent={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Lander;