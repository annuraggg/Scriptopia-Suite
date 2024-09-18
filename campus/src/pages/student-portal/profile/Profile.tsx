import About from "./About";
import Experience from "./Experience";
import Education from "./Education";
import Awards from "./Awards";
import Certifications from "./Certifications";
import Skills from "./Skills";
import Contact from "./Contact";
import Publications from "./Publications";

const Profile = () => {
  return (
    <div className="flex gap-3 w-full h-full p-4">
      <div className=" flex flex-col w-2/5 h-full gap-3">
        <Contact />
        <Skills />
        <Certifications />
        <Publications />
      </div>
      <div className="flex flex-col w-4/5 p-4 border-2 border-black h-full gap-3">
        <About />
        <Experience />
        <Education />
        <Awards />
      </div>
    </div>
  );
};

export default Profile;
