const Navbar = () => {
  const navLinks = [
    { name: "Platform", link: "/dashboard" },
    { name: "Enterprise", link: "https://enterprise.scriptopia.tech" },
    { name: "Meets", link: "https://meet.scriptopia.tech" },
  ];

  const navEndLinks = [
    { name: "Sign In", link: "https://accounts.scriptopia.tech/sign-in" },
    { name: "Sign Up", link: "https://accounts.scriptopia.tech/sign-up" },
  ];

  return (
    <div className="flex justify-between p-3 px-10 border-b">
      <img src="./logo.png" alt="Logo" className="w-10 " />
      <div className="flex gap-5">
        {navLinks.map((link) => (
          <a
            href={link.link}
            className="text-gray-500 py-2 hover:text-gray-400 transition-all duration-300"
          >
            {link.name}
          </a>
        ))}
      </div>
      <div className="flex gap-2 items-center justify-center">
        {navEndLinks.map((link, i) => (
          <p
            className={` cursor-pointer transition-all duration-300 py-2 w-20 flex items-center justify-center
                ${i % 2 !== 0 ? "border bg-white text-black" : "text-white"}
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
