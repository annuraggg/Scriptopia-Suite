import { Image } from "@nextui-org/react";
import "./lander.css";
import { useTheme } from "@/components/theme-provider";

const Features = () => {
  const ribbonItems = ["CODE", "LEARN", "COMPETE", "ASSESS", "INTERVIEW"];
  const { theme } = useTheme();

  return (
    <div className="py-10 flex flex-col items-center justify-center">
      <div className="flex gap-5 w-full justify-between px-48 ">
        <div className="max-w-[40%]">
          <h1 className="font-poly text-4xl">Extensive List of Problems</h1>
          <p className="mt-5">
            We have a wide range of problems in multiple languages and
            difficulty levels. Choose from a variety of problems to solve and
            get better at coding.
          </p>
        </div>
        <Image
          src="/problems.png"
          alt="Problems"
          width={600}
          className="border bg-red-400"
          isBlurred
        />
      </div>

      <div className="flex gap-5 w-full justify-between mt-20 flex-row-reverse px-48 ">
        <div className="max-w-[40%]">
          <h1 className="font-poly text-4xl">An Easy Way to Assess Everyone</h1>
          <p className="mt-5">
            Assessing candidates has never been easier. Our platform provides a
            seamless way to assess and evaluate candidates based on their coding
            skills.
          </p>
        </div>
        <Image
          src="/assessment.png"
          alt="Assessment"
          width={600}
          className="border bg-red-400"
          isBlurred
        />
      </div>

      <div className="flex gap-5 w-full justify-between mt-20 px-48 ">
        <div className="max-w-[40%]">
          <h1 className="font-poly text-4xl">
            Enterprise Ready Hiring Solution
          </h1>
          <p className="mt-5">
            Our platform is enterprise ready and can be used to conduct
            interviews and evaluate candidates for your organization. Manage
            your workflow with ease with Assessments, ATS, Assignments and
            Interviews
          </p>
        </div>
        <Image
          src="/enterprise.png"
          alt="Enterprise"
          width={600}
          className="border bg-red-400"
          isBlurred
        />
      </div>

      <div className="flex gap-5 w-full justify-between mt-20 flex-row-reverse px-48 ">
        <div className="max-w-[40%]">
          <h1 className="font-poly text-4xl">Interviewing Made Easy</h1>
          <p className="mt-5">
            Conducting interviews has never been easier. Our platform provides a
            seamless way to conduct interviews and evaluate candidates.
          </p>
        </div>
        <Image
          src="/enterprise.png"
          alt="Interview"
          width={600}
          className="border bg-red-400"
          isBlurred
        />
      </div>

      <div
        className={`overflow-hidden mt-20 ${
          theme === "dark" ? "ribbon-parent-dark" : "ribbon-parent"
        } overflow-y-hidden max-w-full`}
      >
        <div className="flex scrolling-wrapper py-5">
          {ribbonItems
            .concat(ribbonItems)
            .concat(ribbonItems)
            .concat(ribbonItems)
            .concat(ribbonItems)
            .concat(ribbonItems)
            .concat(ribbonItems)
            .concat(ribbonItems)
            .concat(ribbonItems)
            .map((item, index) => (
              <div key={index} className="flex items-center justify-center p-4">
                <p className="font-neue font-extrabold text-4xl">{item}</p>
                <img src="logo.png" alt="Logo" className="w-10 mx-10" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
