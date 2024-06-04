import { UserButton } from "@clerk/clerk-react";

const Navbar = ({ exclude }: { exclude: string[] }) => {
  const currentPath = window.location.pathname;
  const links = [
    {
      path: "/problems",
      label: "Problems",
    },
    {
      path: "/assessments",
      label: "Assessments",
    },
  ];

  return (
    <div
      className={`
    ${exclude.includes(currentPath) ? "hidden" : ""}
     px-10 w-full h-[10vh] flex items-center justify-between sticky top-0 z-50 backdrop-filter backdrop-blur-lg 
    `}
    >
      <div className="flex items-center gap-5">
        <img
          src="./logo1080_transparent_color_large.png"
          alt="logo"
          className="h-8 w-8 mr-5"
        />
        {links.map((link) => (
          <a
            key={link.path}
            href={link.path}
            className="hover:text-blue-500 duration-200 transition-all"
          >
            {link.label}
          </a>
        ))}
      </div>
      <div className="">
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
