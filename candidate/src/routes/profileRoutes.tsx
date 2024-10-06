import General from "@/pages/profile/General";
import Education from "@/pages/profile/Education";
import Work from "@/pages/profile/Work";
import Skills from "@/pages/profile/Skills";
import Responsibilities from "@/pages/profile/Responsibilities";
import Projects from "@/pages/profile/Projects";
import Awards from "@/pages/profile/Awards";
import Certifications from "@/pages/profile/Certifications";
import Competitions from "@/pages/profile/Competitions";
import Conferences from "@/pages/profile/Conferences";
import Patents from "@/pages/profile/Patents";
import Scholarships from "@/pages/profile/Scholarships";
import Volunteering from "@/pages/profile/Volunteering";
import ExtraCurricular from "@/pages/profile/ExtraCurricular";
import Publications from "@/pages/profile/Publications";

const profileRoutes = [
  { path: "", element: <General /> },
  { path: "education", element: <Education /> },
  { path: "work", element: <Work /> },
  { path: "skills", element: <Skills /> },
  { path: "responsibilities", element: <Responsibilities /> },
  { path: "projects", element: <Projects /> },
  { path: "awards", element: <Awards /> },
  { path: "certifications", element: <Certifications /> },
  { path: "competitions", element: <Competitions /> },
  { path: "conferences", element: <Conferences /> },
  { path: "patents", element: <Patents /> },
  { path: "scholarships", element: <Scholarships /> },
  { path: "volunteering", element: <Volunteering /> },
  { path: "extra-curricular", element: <ExtraCurricular /> },
  { path: "publications", element: <Publications /> },
];

export default profileRoutes;