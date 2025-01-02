import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { ArrowRight, Code2, Brain, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "./Navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { SparklesCore } from "@/components/ui/sparkles";

const Lander = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate("/dashboard");
    } else {
      navigate("/sign-in");
    }
  };

  const features = [
    {
      icon: <Code2 className="w-6 h-6 text-teal-400" />,
      title: "Code",
      description: "Write, test, and perfect your code",
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      title: "Learn",
      description: "Master new programming concepts",
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      title: "Compete",
      description: "Challenge yourself against others",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <BackgroundBeams />
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="absolute inset-0 top-40">
          <SparklesCore
            id="tsparticles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={50}
            className="w-full h-full"
            particleColor="#94A3B8"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="text-6xl md:text-6xl font-bold mb-8">
              <span className="text-teal-100">Learn</span>
              <span className="text-purple-100">. Code</span>
              <span className="text-amber-100">. Compete</span>
            </div>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl animate-fade-in">
              Discover a versatile coding platform that enhances your skills and
              streamlines hiring solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-background/60 backdrop-blur-lg border-muted transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-muted">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <Button
              size="lg"
              variant="default"
              onClick={handleGetStarted}
              className="bg-teal-500 hover:bg-teal-600"
            >
              Get Started
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-teal-500 text-teal-500 hover:bg-teal-500/10"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* MacBook Preview Section */}
      <section className="min-h-[200vh] relative">
        <MacbookScroll src="./lander1.png" showGradient={true} />
      </section>

      {/* Features Grid */}
      <section className="px-4 py-24 bg-gradient-to-b from-background to-background/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to excel
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From comprehensive problem sets to real-time assessments, we
              provide all the tools you need to succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="bg-background/60 backdrop-blur-lg border-muted transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mb-4">
                    <Code2 className="w-6 h-6 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Feature {i + 1}
                  </h3>
                  <p className="text-gray-400">
                    Detailed description of the feature and its benefits for
                    users.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 text-center relative overflow-hidden">
        <BackgroundBeams className="opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to start coding?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join thousands of developers who are already using our platform to
            improve their coding skills.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-teal-500 hover:bg-teal-600"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Lander;
