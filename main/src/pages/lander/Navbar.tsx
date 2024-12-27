import { useTheme } from "@/components/theme-provider";
import { Button } from "@nextui-org/react";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const navLinks = [
    { name: "Platform", link: "https://code.scriptopia.tech" },
    { name: "Enterprise", link: "https://enterprise.scriptopia.tech" },
    { name: "Campus", link: "https://enterprise.scriptopia.tech" },
    { name: "Candidates", link: "https://candidates.scriptopia.tech" },
    { name: "Meets", link: "https://meet.scriptopia.tech" },
  ];

  const navEndLinks = [
    { name: "Sign In", link: "https://accounts.scriptopia.tech/sign-in" },
    { name: "Sign Up", link: "https://accounts.scriptopia.tech/sign-up" },
  ];

  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-between p-3 px-10 border-b fixed z-50 backdrop-blur-2xl bg-black bg-opacity-10 w-full">
      <img src="./logo.png" alt="Logo" className="w-12" />
      <div className="flex gap-5">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.link}
            className="text-gray-500 py-2 hover:text-gray-400 transition-all duration-300"
          >
            {link.name}
          </a>
        ))}
      </div>
      <div className="flex gap-2 items-center justify-center">
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          className="hidden"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
        {navEndLinks.map((link, i) => (
          <p
            key={link.name}
            className={` cursor-pointer transition-all duration-300 py-2 w-20 flex items-center justify-center
                ${i % 2 !== 0 ? "border bg-white text-black" : "text-foreground"}
                `}
            onClick={() => window.open(link.link, "_self")}
          >
            {link.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
